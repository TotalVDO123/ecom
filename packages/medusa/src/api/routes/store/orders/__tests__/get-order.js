import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("GET /store/orders", () => {
  describe("successfully gets an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "GET",
        `/store/orders/${IdMap.getId("test-order")}`
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(OrderServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieve).toHaveBeenCalledWith(
        IdMap.getId("test-order")
      )
    })

    it("returns order", () => {
      expect(subject.body._id).toEqual(IdMap.getId("test-order"))
    })
  })

  describe("returns 404 on undefined order", () => {
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/orders/none`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls OrderService Retrieve", () => {
      expect(OrderServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.retrieve).toHaveBeenCalledWith("none")
    })

    it("returns 404", () => {
      expect(subject.status).toEqual(404)
    })
  })
})
