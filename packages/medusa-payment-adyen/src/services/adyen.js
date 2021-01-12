import axios from "axios"
import _ from "lodash"
import { hmacValidator } from "@adyen/api-library"
import { BaseService } from "medusa-interfaces"
import { Client, Config, CheckoutAPI } from "@adyen/api-library"

class AdyenService extends BaseService {
  constructor({ cartService }, options) {
    super()

    /** @private @constant {CartService} */
    this.cartService_ = cartService

    /**
     * {
     *    api_key: "",
     *    notification_hmac: "",
     *    return_url: "",
     *    merchant_account: "",
     *    origin: "",
     *    environment: "",
     *    live_endpoint_prefix: "",
     *    payment_endpoint: ""
     * }
     */
    this.options_ = options

    /** @private @constant {AxiosClient} */
    this.adyenClient_ = this.initAdyenClient()

    /** @private @constant {AdyenClient} */
    this.adyenPaymentApi = this.initPaymentClient()
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new AdyenService({
      cartService: this.cartService_,
      totalsService: this.totalsService_,
    })

    this.transactionManager_ = transactionManager

    return cloned
  }

  getOptions() {
    return this.options_
  }

  initPaymentClient() {
    return axios.create({
      baseURL: this.options_.payment_endpoint,
      headers: {
        "Content-Type": "application/json",
        "x-API-key": this.options_.api_key,
      },
    })
  }

  initAdyenClient() {
    const config = new Config()
    config.apiKey = this.options_.api_key
    config.merchantAccount = this.options_.merchant_account

    const client = new Client({
      config,
    })

    client.setEnvironment(
      this.options_.environment,
      this.options_.live_endpoint_prefix
    )

    return client
  }

  /**
   * Validates an Adyen webhook notification
   * @param {object} notification - notification to validate
   * @returns {string} the status of the payment
   */
  validateNotification(notification) {
    const validator = new hmacValidator()

    const validated = validator.validateHMAC(
      notification,
      this.options_.notification_hmac
    )
    return validated
  }

  /**
   * Retrieve stored payment methods from Adyen.
   * @param {Customer} customer - customer to retrieve methods for
   * @returns {Promise} result containing the stored payment methods from Adyen
   */
  async retrieveSavedMethods(customer) {
    let request = {
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
      shopperReference: customer.id,
    }

    try {
      const checkout = new CheckoutAPI(this.adyenClient_)
      const methods = await checkout.paymentMethods(request)
      return methods.storedPaymentMethods || []
    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieve payment methods from Adyen.
   * @param {string[]} allowedMethods - the allowed methods based on region
   * @param {number} total - total amount to be paid with payment methods
   * @param {string} currency - currency code to use for the payment
   * @param {string} customerId - id of the customer paying
   * @returns {Promise} result containing the payment methods from Adyen
   */
  async retrievePaymentMethods(allowedMethods, total, currency, customerId) {
    let request = {
      allowedPaymentMethods: allowedMethods,
      amount: {
        value: total * 100,
        currency: currency,
      },
      merchantAccount: this.options_.merchant_account,
      channel: "Web",
      shopperReference: customerId,
    }

    try {
      const checkout = new CheckoutAPI(this.adyenClient_)
      return checkout.paymentMethods(request)
    } catch (error) {
      throw error
    }
  }

  /**
   * Status for Adyen payment.
   * @param {object} paymentData - payment method data from cart
   * @returns {string} the status of the payment
   */
  getStatus(paymentData) {
    const { resultCode } = paymentData
    let status = "pending"

    if (resultCode === "Pending") {
      return status
    }

    if (resultCode === "Refused") {
      return status
    }

    if (resultCode === "Error") {
      status = "error"
    }

    if (resultCode === "Authorised") {
      status = "authorized"
    }

    if (resultCode === "Canceled") {
      status = "canceled"
    }

    if (resultCode === "ChallengeShopper") {
      status = "requires_more"
    }

    if (resultCode === "RedirectShopper") {
      status = "requires_more"
    }

    if (resultCode === "IdentifyShopper") {
      status = "requires_more"
    }

    return status
  }

  /**
   * Creates Adyen payment object.
   * @param {Cart} cart - cart to initiate payment for
   * @returns {object} empty payment data
   */
  async createPayment(cart) {
    return { cart_id: cart.id }
  }

  /**
   * Retrieves Adyen payment. This is not supported by adyen, so we simply
   * return the current payment method data
   * @param {object} data - payment session
   * @returns {object} payment method data
   */
  async getPaymentData(paymentSession) {
    return { ...paymentSession.data }
  }

  /**
   * Retrieves Adyen payment. This is not supported by adyen, so we simply
   * return the current payment method data
   * @param {object} sessionData - the data of the payment to retrieve
   * @returns {Promise<object>} Stripe payment intent
   */
  async retrieve(sessionData) {
    return sessionData
  }

  /**
   * Creates and authorizes an Adyen payment.
   * Requires cart_id in context for authorization.
   * Return status of authorization result.
   * @param {object} sessionData - payment session data
   * @param {object} context - properties relevant to current context
   * @returns {Promise<{ status: string, data: object }>} result with data and status
   */
  async authorizePayment(session, context) {
    const sessionData = session.data

    // If session data is present, we already called authorize once.
    // Therefore, this is most likely a call for getting additional details
    if (session.status === "requires_more") {
      const updated = await this.updatePaymentData(sessionData, {
        details: sessionData.details,
        paymentData: sessionData.paymentData,
      })

      return { data: updated, status: this.getStatus(updated) }
    }

    if (session.status === "authorized") {
      return { data: sessionData, status: "authorized" }
    }

    const cart = await this.cartService_.retrieve(session.cart_id, {
      select: ["total"],
      relations: ["region", "shipping_address"],
    })

    const amount = {
      currency: cart.region.currency_code.toUpperCase(),
      value: cart.total,
    }

    let request = {
      amount,
      shopperIP: context.ip_address || "",
      shopperReference: cart.customer_id,
      paymentMethod: sessionData.paymentData.paymentMethod,
      reference: cart.id,
      merchantAccount: this.options_.merchant_account,
      returnUrl: this.options_.return_url,
      origin: this.options_.origin,
      channel: "Web",
      redirectFromIssuerMethod: "GET",
      browserInfo: sessionData.browserInfo || {},
      billingAddress: {
        city: cart.shipping_address.city,
        country: cart.shipping_address.country_code,
        houseNumberOrName: cart.shipping_address.address_2 || "",
        postalCode: cart.shipping_address.postal_code,
        stateOrProvice: cart.shipping_address.province || "",
        street: cart.shipping_address.address_1,
      },
      metadata: {
        cart_id: cart.id,
      },
    }

    // If customer chose to save the payment method
    if (sessionData.storePaymentMethod) {
      request.storePaymentMethod = "true"
      request.shopperInteraction = "Ecommerce"
      request.recurringProcessingModel = "CardOnFile"
    }

    const checkout = new CheckoutAPI(this.adyenClient_)

    try {
      const authorizedPayment = await checkout.payments(request, {
        idempotencyKey: context.idempotency_key || "",
      })

      return {
        data: authorizedPayment,
        status: this.getStatus(authorizedPayment),
      }
    } catch (error) {
      throw error
    }
  }

  async updatePaymentData(sessionData, update) {
    if (!update.details) {
      return { ...sessionData, ...update }
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    const updated = await checkout.paymentsDetails(update)

    return updated
  }

  /**
   * Updates an Adyen payment.
   * @param {object} paymentData - payment data to update
   * @param {details} details - details to update
   * @returns {Promise} result of the update operation
   */
  async updatePayment(paymentData, details) {
    return paymentData
  }

  /**
   * Additional details
   * @param {object} paymentData - payment data
   * @param {object} details - payment details
   * @returns {Promise} current payment result
   */
  async additionalDetails(paymentData, details) {
    const request = {
      paymentData,
      details,
    }

    const checkout = new CheckoutAPI(this.adyenClient_)
    return checkout.paymentsDetails(request)
  }

  /**
   * Captures an Adyen payment
   * @param {object} data - payment data to capture
   * @returns {string} status = processing_captures
   */
  async capturePayment(data) {
    const { pspReference, amount, merchantReference } = data

    try {
      const captured = await this.adyenPaymentApi.post("/capture", {
        originalReference: pspReference,
        modificationAmount: amount,
        merchantAccount: this.options_.merchant_account,
        reference: merchantReference,
      })

      if (
        captured.data.pspReference &&
        captured.data.response !== "[capture-received]"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Could not process capture"
        )
      }

      return "processing_capture"
    } catch (error) {
      throw error
    }
  }

  /**
   * Refunds an Adyen payment
   * @param {object} paymentData - payment data to refund
   * @param {number} amountToRefund - amount to refund
   * @returns {object} payment data result of refund
   */
  async refundPayment(data, amountToRefund) {
    const { originalReference, amount, merchantReference } = data

    const refundAmount = {
      currency: amount.currency,
      value: amountToRefund * 100,
    }

    try {
      await this.adyenPaymentApi.post("/refund", {
        originalReference,
        merchantAccount: this.options_.merchant_account,
        modificationAmount: refundAmount,
        reference: merchantReference,
      })
      return "processing_refund"
    } catch (error) {
      throw error
    }
  }

  /**
   * Adyen does not have a way of deleting payments, hence the empty impl.
   */
  async deletePayment(_) {
    return {}
  }

  /**
   * Cancels an Adyen payment.
   * @param {object} paymentData - payment data to cancel
   * @returns {object} payment data result of cancel
   */
  async cancelPayment(paymentData) {
    const { pspReference } = paymentData

    try {
      return this.adyenPaymentApi.post("/cancel", {
        originalReference: pspReference,
        merchantAccount: this.options_.merchant_account,
      })
    } catch (error) {
      throw error
    }
  }
}

export default AdyenService
