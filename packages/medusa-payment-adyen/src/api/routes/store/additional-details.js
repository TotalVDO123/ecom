import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    payment_data: Validator.any().required(),
    details: Validator.any().required(),
    provider_id: Validator.string().required(),
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const adyen = req.scope.resolve("adyenService")
    const cartService = req.scope.resolve("cartService")

    const result = await adyen.additionalDetails(
      value.payment_data,
      value.details
    )

    const updatedPaymentSession = {
      pspReference: result.pspReference,
      resultCode: result.resultCode,
    }

    await cartService.updatePaymentSession(
      value.cart_id,
      value.provider_id,
      updatedPaymentSession
    )

    res.status(200).json({ data: result })
  } catch (err) {
    console.log(err)
    throw err
  }
}
