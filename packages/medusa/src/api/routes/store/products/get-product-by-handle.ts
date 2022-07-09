import { defaultStoreProductsRelations } from "."
import {
  CartService,
  PricingService,
  ProductService,
  RegionService,
} from "../../../../services"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /products/{handle}/handle
 * operationId: GetProductsProductByHandle
 * summary: Retrieves a Product by handle
 * description: "Retrieves a Product by handle."
 * parameters:
 *   - (path) handle=* {string} The handle of the Product.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const { handle } = req.params

  const validated = await validator(PriceSelectionParams, req.query)

  const customer_id = req.user?.customer_id

  const productService: ProductService = req.scope.resolve("productService")
  const pricingService: PricingService = req.scope.resolve("pricingService")
  const cartService: CartService = req.scope.resolve("cartService")
  const regionService: RegionService = req.scope.resolve("regionService")
  const rawProduct = await productService.retrieveByHandle(handle, {
    relations: defaultStoreProductsRelations,
  })

  let regionId = validated.region_id
  let currencyCode = validated.currency_code
  if (validated.cart_id) {
    const cart = await cartService.retrieve(validated.cart_id, {
      select: ["id", "region_id"],
    })
    const region = await regionService.retrieve(cart.region_id, {
      select: ["id", "currency_code"],
    })
    regionId = region.id
    currencyCode = region.currency_code
  }

  const [product] = await pricingService.setProductPrices([rawProduct], {
    cart_id: validated.cart_id,
    customer_id: customer_id,
    region_id: regionId,
    currency_code: currencyCode,
    include_discount_prices: true,
  })

  res.json({ product })
}
