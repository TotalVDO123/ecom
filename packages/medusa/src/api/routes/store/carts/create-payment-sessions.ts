import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import { EntityManager } from "typeorm";
import IdempotencyKeyService from "../../../../services/idempotency-key";

/**
 * @oas [post] /carts/{id}/payment-sessions
 * operationId: "PostCartsCartPaymentSessions"
 * summary: "Initialize Payment Sessions"
 * description: "Creates Payment Sessions for each of the available Payment Providers in the Cart's Region."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    await manager.transaction(async (transactionManager) => {
      idempotencyKey = await idempotencyKeyService.withTransaction(transactionManager).initializeRequest(
        headerKey,
        req.method,
        req.params,
        req.path
      )
    })
  } catch (error) {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  try {
    let inProgress = true
    let err: unknown = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          await manager.transaction(async (transactionManager) => {
            const { key, error } = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(
                idempotencyKey.idempotency_key,
                async (manager) => {
                  await cartService.withTransaction(manager).setPaymentSessions(id)

                  const cart = await cartService.withTransaction(manager).retrieve(id, {
                    select: defaultStoreCartFields,
                    relations: defaultStoreCartRelations,
                  })

                  const data = await decorateLineItemsWithTotals(cart, req)

                  return {
                    response_code: 200,
                    response_body: { cart: data },
                  }
                })

            if (error) {
              inProgress = false
              err = error
            } else {
              idempotencyKey = key
            }
          })
          break
        }

        case "finished": {
          inProgress = false
          break
        }

        default:
          await manager.transaction(async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .update(
                idempotencyKey.idempotency_key,
                {
                  recovery_point: "finished",
                  response_code: 500,
                  response_body: { message: "Unknown recovery point" },
                }
              )
          })
          break
      }
    }

    res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
  } catch (e) {
    console.log(e)
    throw e
  }
}
