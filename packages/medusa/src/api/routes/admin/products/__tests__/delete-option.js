import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"

describe("DELETE /admin/products/:id/option/:optionId", () => {
  describe("successfully updates an option", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "DELETE",
        `/admin/products/${IdMap.getId(
          "productWithOptions"
        )}/option/${IdMap.getId("option1")}`,
        {
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200 and correct delete info", () => {
      expect(subject.status).toEqual(200)
      expect(subject.body).toEqual({
        optionId: IdMap.getId("option1"),
        object: "option",
        deleted: true,
      })
    })

    it("calls update", () => {
      expect(ProductServiceMock.deleteOption).toHaveBeenCalledTimes(1)
      expect(ProductServiceMock.deleteOption).toHaveBeenCalledWith(
        IdMap.getId("productWithOptions"),
        IdMap.getId("option1")
      )
    })
  })
})
