import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id/capture-payment", () => {
  describe("successfully fulfills an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}/capture-payment`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls OrderService capturePayment", () => {
      expect(OrderServiceMock.capturePayment).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.capturePayment).toHaveBeenCalledWith(
        IdMap.getId("test-order")
      )
    })

    it("returns order with payment_status = captured", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body._id).toEqual(IdMap.getId("test-order"))
      expect(subject.body.payment_status).toEqual("captured")
    })
  })
})
