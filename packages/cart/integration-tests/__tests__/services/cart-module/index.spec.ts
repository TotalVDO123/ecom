import { ICartModuleService } from "@medusajs/types"
import { initialize } from "../../../../src/initialize"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Cart Module Service", () => {
  let service: ICartModuleService

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_CART_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should throw an error when required params are not passed", async () => {
      const error = await service
        .create([
          {
            email: "test@email.com",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for Cart.currency_code is required, 'undefined' found"
      )
    })

    it("should create a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [cart] = await service.list({ id: [createdCart.id] })

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
        })
      )
    })

    it("should create a cart with billing + shipping address successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
          billing_address: {
            first_name: "John",
            last_name: "Doe",
          },
          shipping_address: {
            first_name: "John",
            last_name: "Doe",
          },
        },
      ])

      const [cart] = await service.list(
        { id: [createdCart.id] },
        { relations: ["billing_address", "shipping_address"] }
      )

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          billing_address: expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
          }),
          shipping_address: expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
          }),
        })
      )
    })

    it("should create a cart with billing id + shipping id successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
          last_name: "Doe",
        },
      ])

      const [createdCart] = await service.create([
        {
          currency_code: "eur",
          billing_address_id: createdAddress.id,
          shipping_address_id: createdAddress.id,
        },
      ])

      expect(createdCart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          billing_address: expect.objectContaining({
            id: createdAddress.id,
            first_name: "John",
            last_name: "Doe",
          }),
          shipping_address: expect.objectContaining({
            id: createdAddress.id,
            first_name: "John",
            last_name: "Doe",
          }),
        })
      )
    })
  })

  describe("update", () => {
    it("should throw an error if cart does not exist", async () => {
      const error = await service
        .update([
          {
            id: "none-existing",
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain('Cart with id "none-existing" not found')
    })

    it("should update a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [updatedCart] = await service.update([
        {
          id: createdCart.id,
          email: "test@email.com",
        },
      ])

      const [cart] = await service.list({ id: [createdCart.id] })

      expect(cart).toEqual(
        expect.objectContaining({
          id: createdCart.id,
          currency_code: "eur",
          email: updatedCart.email,
        })
      )
    })
  })

  describe("delete", () => {
    it("should delete a cart successfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      await service.delete([createdCart.id])

      const carts = await service.list({ id: [createdCart.id] })

      expect(carts.length).toEqual(0)
    })
  })

  describe("createAddresses", () => {
    it("should create an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      const [address] = await service.listAddresses({
        id: [createdAddress.id!],
      })

      expect(address).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "John",
        })
      )
    })
  })

  describe("updateAddresses", () => {
    it("should update an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      const [updatedAddress] = await service.updateAddresses([
        { id: createdAddress.id!, first_name: "Jane" },
      ])

      expect(updatedAddress).toEqual(
        expect.objectContaining({
          id: createdAddress.id,
          first_name: "Jane",
        })
      )
    })
  })

  describe("deleteAddresses", () => {
    it("should delete an address successfully", async () => {
      const [createdAddress] = await service.createAddresses([
        {
          first_name: "John",
        },
      ])

      await service.deleteAddresses([createdAddress.id!])

      const [address] = await service.listAddresses({
        id: [createdAddress.id!],
      })

      expect(address).toBe(undefined)
    })
  })

  describe("addLineItems", () => {
    it("should add a line item to cart succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const items = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(items[0]).toEqual(
        expect.objectContaining({
          title: "test",
          quantity: 1,
          unit_price: 100,
        })
      )
      expect(cart.items?.length).toBe(1)
    })

    it("should add multiple line items to cart succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      await service.addLineItems([
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
          cart_id: createdCart.id,
        },
        {
          quantity: 2,
          unit_price: 200,
          title: "test-2",
          cart_id: createdCart.id,
        },
      ])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "test",
            quantity: 1,
            unit_price: 100,
          }),
          expect.objectContaining({
            title: "test-2",
            quantity: 2,
            unit_price: 200,
          }),
        ])
      )

      expect(cart.items?.length).toBe(2)
    })

    it("should add multiple line items to multiple carts succesfully", async () => {
      let [eurCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      let [usdCart] = await service.create([
        {
          currency_code: "usd",
        },
      ])

      const items = await service.addLineItems([
        {
          cart_id: eurCart.id,
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
        {
          cart_id: usdCart.id,
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const carts = await service.list(
        { id: [eurCart.id, usdCart.id] },
        { relations: ["items"] }
      )

      eurCart = carts.find((c) => c.currency_code === "eur")!
      usdCart = carts.find((c) => c.currency_code === "usd")!

      const eurItems = items.filter((i) => i.cart_id === eurCart.id)
      const usdItems = items.filter((i) => i.cart_id === usdCart.id)

      expect(eurCart.items![0].id).toBe(eurItems[0].id)
      expect(usdCart.items![0].id).toBe(usdItems[0].id)

      expect(eurCart.items?.length).toBe(1)
      expect(usdCart.items?.length).toBe(1)
    })

    it("should throw if cart does not exist", async () => {
      const error = await service
        .addLineItems("foo", [
          {
            quantity: 1,
            unit_price: 100,
            title: "test",
            tax_lines: [],
          },
        ])
        .catch((e) => e)

      expect(error.message).toContain("Cart with id: foo was not found")
    })

    it("should throw an error when required params are not passed adding to a single cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const error = await service
        .addLineItems(createdCart.id, [
          {
            quantity: 1,
            title: "test",
          },
        ] as any)
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for LineItem.unit_price is required, 'undefined' found"
      )
    })

    it("should throw a generic error when required params are not passed using bulk add method", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const error = await service
        .addLineItems([
          {
            cart_id: createdCart.id,
            quantity: 1,
            title: "test",
          },
        ] as any)
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for LineItem.unit_price is required, 'undefined' found"
      )
    })
  })

  describe("updateLineItems", () => {
    it("should update a line item in cart succesfully with selector approach", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
          tax_lines: [],
        },
      ])

      expect(item.title).toBe("test")

      const [updatedItem] = await service.updateLineItems(
        { cart_id: createdCart.id },
        {
          title: "test2",
        }
      )

      expect(updatedItem.title).toBe("test2")
    })

    it("should update a line item in cart succesfully with id approach", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
          tax_lines: [],
        },
      ])

      expect(item.title).toBe("test")

      const updatedItem = await service.updateLineItems(item.id, {
        title: "test2",
      })

      expect(updatedItem.title).toBe("test2")
    })

    it("should update line items in carts succesfully with multi-selector approach", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const items = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
        {
          quantity: 2,
          unit_price: 200,
          title: "other-test",
        },
      ])

      expect(items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "test",
            quantity: 1,
            unit_price: 100,
          }),
          expect.objectContaining({
            title: "other-test",
            quantity: 2,
            unit_price: 200,
          }),
        ])
      )

      const itemOne = items.find((i) => i.title === "test")
      const itemTwo = items.find((i) => i.title === "other-test")

      const updatedItems = await service.updateLineItems([
        {
          selector: { cart_id: createdCart.id },
          data: {
            title: "changed-test",
          },
        },
        {
          selector: { id: itemTwo!.id },
          data: {
            title: "changed-other-test",
          },
        },
      ])

      expect(updatedItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "changed-test",
            quantity: 1,
            unit_price: 100,
          }),
          expect.objectContaining({
            title: "changed-other-test",
            quantity: 2,
            unit_price: 200,
          }),
        ])
      )
    })
  })

  describe("removeLineItems", () => {
    it("should remove a line item succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
          tax_lines: [],
        },
      ])

      expect(item.title).toBe("test")

      await service.removeLineItems([item.id])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(cart.items?.length).toBe(0)
    })

    it("should remove multiple line items succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item, item2] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
        {
          quantity: 1,
          unit_price: 100,
          title: "test-2",
        },
      ])

      await service.removeLineItems([item.id, item2.id])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items"],
      })

      expect(cart.items?.length).toBe(0)
    })
  })

  describe("setLineItemTaxLines", () => {
    it("should set line item tax lines for a cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const [itemTwo] = await service.addLineItems(createdCart.id, [
        {
          quantity: 2,
          unit_price: 200,
          title: "test-2",
        },
      ])

      const adjustments = await service.setLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
        {
          item_id: itemTwo.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
          expect.objectContaining({
            item_id: itemTwo.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )
    })

    it("should replace line item tax lines for a cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const adjustments = await service.setLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )

      await service.setLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 25,
          code: "TX-2",
        },
      ])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items.tax_lines"],
      })

      expect(cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemOne.id,
            tax_lines: expect.arrayContaining([
              expect.objectContaining({
                item_id: itemOne.id,
                rate: 20,
                code: "TX",
              }),
            ]),
          }),
        ])
      )

      expect(cart.items?.length).toBe(1)
      expect(cart.items?.[0].tax_lines?.length).toBe(1)
    })

    it("should remove all line item tax lines for a cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const adjustments = await service.setLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )

      await service.setLineItemTaxLines(createdCart.id, [])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items.tax_lines"],
      })

      expect(cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemOne.id,
            tax_lines: [],
          }),
        ])
      )

      expect(cart.items?.length).toBe(1)
      expect(cart.items?.[0].tax_lines?.length).toBe(0)
    })

    it("should update line item tax lines for a cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const adjustments = await service.setLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )

      await service.setLineItemAdjustments(createdCart.id, [
        {
          id: adjustments[0].id,
          rate: 25,
          code: "TX",
        },
      ])

      const cart = await service.retrieve(createdCart.id, {
        relations: ["items.tax_lines"],
      })

      expect(cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemOne.id,
            tax_lines: [
              expect.objectContaining({
                id: adjustments[0].id,
                item_id: itemOne.id,
                rate: 25,
                code: "TX",
              }),
            ],
          }),
        ])
      )

      expect(cart.items?.length).toBe(1)
      expect(cart.items?.[0].tax_lines?.length).toBe(1)
    })
  })

  describe("addLineItemAdjustments", () => {
    it("should add line item tax lines for items in a cart", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const adjustments = await service.addLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )
    })

    it("should add multiple line item tax lines for multiple line items", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])
      const [itemTwo] = await service.addLineItems(createdCart.id, [
        {
          quantity: 2,
          unit_price: 200,
          title: "test-2",
        },
      ])

      const adjustments = await service.addLineItemTaxLines(createdCart.id, [
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
        {
          item_id: itemTwo.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          }),
          expect.objectContaining({
            item_id: itemTwo.id,
            rate: 20,
            code: "TX",
          }),
        ])
      )
    })

    it("should add line item tax lines for line items on multiple carts", async () => {
      const [cartOne] = await service.create([
        {
          currency_code: "eur",
        },
      ])
      const [cartTwo] = await service.create([
        {
          currency_code: "usd",
        },
      ])

      const [itemOne] = await service.addLineItems(cartOne.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])
      const [itemTwo] = await service.addLineItems(cartTwo.id, [
        {
          quantity: 2,
          unit_price: 200,
          title: "test-2",
        },
      ])

      await service.addLineItemTaxLines([
        // item from cart one
        {
          item_id: itemOne.id,
          rate: 20,
          code: "TX",
        },
        // item from cart two
        {
          item_id: itemTwo.id,
          rate: 25,
          code: "TX-2",
        },
      ])

      const cartOneItems = await service.listLineItems(
        { cart_id: cartOne.id },
        { relations: ["tax_lines"] }
      )
      const cartTwoItems = await service.listLineItems(
        { cart_id: cartTwo.id },
        { relations: ["tax_lines"] }
      )

      expect(cartOneItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                item_id: itemOne.id,
                rate: 20,
                code: "TX",
              }),
            ]),
          }),
        ])
      )
      expect(cartTwoItems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                item_id: itemTwo.id,
                rate: 25,
                code: "TX-2",
              }),
            ]),
          }),
        ])
      )
    })

    it("should throw if line item is not associated with cart", async () => {
      const [cartOne] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [cartTwo] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [itemOne] = await service.addLineItems(cartOne.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const error = await service
        .addLineItemTaxLines(cartTwo.id, [
          {
            item_id: itemOne.id,
            rate: 20,
            code: "TX",
          },
        ])
        .catch((e) => e)

      expect(error.message).toBe(
        `Line item with id ${itemOne.id} does not exist on cart with id ${cartTwo.id}`
      )
    })
  })

  describe("removeLineItemAdjustments", () => {
    it("should remove line item tax line succesfully", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const [adjustment] = await service.addLineItemTaxLines(createdCart.id, [
        {
          item_id: item.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(adjustment.item_id).toBe(item.id)

      await service.removeLineItemTaxLines(adjustment.id)

      const taxLines = await service.listLineItemTaxLines({
        item_id: item.id,
      })

      expect(taxLines?.length).toBe(0)
    })

    it("should remove line item tax lines succesfully with selector", async () => {
      const [createdCart] = await service.create([
        {
          currency_code: "eur",
        },
      ])

      const [item] = await service.addLineItems(createdCart.id, [
        {
          quantity: 1,
          unit_price: 100,
          title: "test",
        },
      ])

      const [taxLine] = await service.addLineItemTaxLines(createdCart.id, [
        {
          item_id: item.id,
          rate: 20,
          code: "TX",
        },
      ])

      expect(taxLine.item_id).toBe(item.id)

      await service.removeLineItemTaxLines({ item_id: item.id })

      const taxLines = await service.listLineItemTaxLines({
        item_id: item.id,
      })

      expect(taxLines?.length).toBe(0)
    })
  })
})
