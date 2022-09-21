import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import OrderEditingFeatureFlag from "../../../../../loaders/feature-flags/order-editing"

describe("GET /admin/order-edits/:id", () => {
  describe("successfully requests an order edit", () => {
    const orderEditId = IdMap.getId("testRequestOrder")
    let subject

    beforeAll(async () => {
      subject = await request("POST", `/admin/order-edits/${orderEditId}/request-confirmation`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
        flags: [OrderEditingFeatureFlag],
      })
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService requestConcfirmation", () => {
      expect(orderEditServiceMock.requestConfirmation).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.requestConfirmation).toHaveBeenCalledWith(orderEditId, IdMap.getId("admin_user"))
    })

    it("returns updated orderEdit", () => {
      expect(subject.body.order_edit).toEqual(expect.objectContaining({
        id: orderEditId, 
        requested_at: expect.any(String),
        requested_by: IdMap.getId("admin_user")
      }))
    })
  })
})
