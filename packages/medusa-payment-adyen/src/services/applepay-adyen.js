import _ from "lodash"
import https from "https"
import fs from "fs"
import axios from "axios"
import { PaymentService } from "medusa-interfaces"
const certificate = fs.readFileSync("./apple-pay-cert.pem", "utf8")

class ApplePayAdyenService extends PaymentService {
  static identifier = "applepay-adyen"

  constructor({ adyenService }) {
    super()

    this.adyenService_ = adyenService
  }

  /**
   * Status for Adyen payment.
   * @param {Object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  async getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = "initial"

    if (resultCode === "Authorised") {
      status = "authorized"
    }

    return status
  }

  async createPayment(_) {
    return {}
  }

  async getApplePaySession(validationUrl) {
    const endpointURL = `https://${validationUrl}/paymentSession`

    const httpsAgent = new https.Agent({
      cert: certificate,
      key: certificate,
    })

    return axios.post(
      endpointURL,
      {
        merchantIdentifier: "merchant.com.adyen.teklafabrics.test",
        displayName: "Tekla Fabrics",
        initiative: "web",
        initiativeContext: "teklafabrics.com",
      },
      {
        httpsAgent,
      }
    )
  }

  async authorizePayment(cart, paymentMethod, amount) {
    return this.adyenService_.authorizePayment(cart, paymentMethod, amount)
  }

  async retrievePayment(data) {
    return this.adyenService_.retrievePayment(data)
  }

  async updatePayment(data, _) {
    return this.adyenService_.updatePayment(data)
  }

  async deletePayment(data) {
    return this.adyenService_.deletePayment(data)
  }

  async capturePayment(data) {
    return this.adyenService_.capturePayment(data)
  }

  async refundPayment(data, amountToRefund) {
    return this.adyenService_.refundPayment(data, amountToRefund)
  }

  async cancelPayment(data) {
    return this.adyenService_.cancelPayment(data)
  }
}

export default ApplePayAdyenService
