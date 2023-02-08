import { MockManager, MockRepository } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import DraftOrderService from "../draft-order"
import { LineItemAdjustmentServiceMock } from "../__mocks__/line-item-adjustment"

const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    return this
  },
}

describe("DraftOrderService", () => {
  const totalsService = {
    getTotal: (o) => {
      return o.total || 0
    },
    getSubtotal: (o) => {
      return o.subtotal || 0
    },
    getTaxTotal: (o) => {
      return o.tax_total || 0
    },
    getDiscountTotal: (o) => {
      return o.discount_total || 0
    },
    getShippingTotal: (o) => {
      return o.shipping_total || 0
    },
    getGiftCardTotal: (o) => {
      return o.gift_card_total || 0
    },
  }

  describe("create", () => {
    let result

    const regionService = {
      retrieve: () =>
        Promise.resolve({ id: "test-region", countries: [{ iso_2: "dk" }] }),
      withTransaction: function () {
        return this
      },
    }

    const shippingOptionService = {
      createShippingMethod: jest.fn().mockImplementation(() =>
        Promise.resolve({
          shipping_option: {
            profile_id: "test-profile",
          },
        })
      ),
      withTransaction: function () {
        return this
      },
    }

    const lineItemService = {
      generate: jest.fn().mockImplementation(() =>
        Promise.resolve({
          title: "test-item",
          variant_id: "test-variant",
        })
      ),
      create: jest.fn().mockImplementation((data) => data),
      withTransaction: function () {
        return this
      },
    }

    const productVariantService = {
      retrieve: () =>
        Promise.resolve({
          id: "test-variant",
          product: {
            profile_id: "test-profile",
          },
        }),
      withTransaction: function () {
        return this
      },
    }

    const testOrder = {
      region_id: "test-region",
      shipping_address_id: "test-shipping",
      billing_address_id: "test-billing",
      customer_id: "test-customer",
      items: [
        { id: "test", variant_id: "test-variant", quantity: 2, metadata: {} },
      ],
      shipping_methods: [
        {
          option_id: "test-option",
          data: {},
        },
      ],
    }

    const cartService = {
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: "test-cart",
          ...data,
        })
      ),
      retrieve: jest.fn().mockReturnValue(
        Promise.resolve({
          id: "test-cart",
          ...testOrder,
        })
      ),
      applyDiscount: jest.fn(),
      addShippingMethod: jest.fn(),
      withTransaction: function () {
        return this
      },
    }

    const addressRepository = MockRepository({
      create: (addr) => ({
        ...addr,
      }),
    })

    const draftOrderRepository = MockRepository({
      create: (d) => ({
        ...d,
      }),
      save: (d) => ({
        id: "test-draft-order",
        ...d,
      }),
    })

    const draftOrderService = new DraftOrderService({
      manager: MockManager,
      regionService,
      cartService,
      shippingOptionService,
      lineItemService,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      productVariantService,
      draftOrderRepository,
      addressRepository,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("creates a draft order", async () => {
      const cartId = "test-cart"
      const title = "test-item"

      await draftOrderService.create(testOrder)

      expect(draftOrderRepository.create).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.create).toHaveBeenCalledWith({
        cart_id: cartId,
      })

      expect(cartService.create).toHaveBeenCalledTimes(1)
      expect(cartService.create).toHaveBeenCalledWith({
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        type: "draft_order",
      })

      expect(cartService.retrieve).toHaveBeenCalledTimes(1)
      expect(cartService.retrieve).toHaveBeenCalledWith("test-cart", {
        relations: ["discounts", "discounts.rule", "items", "region"],
      })

      expect(cartService.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(cartService.addShippingMethod).toHaveBeenCalledWith(
        "test-cart",
        "test-option",
        {}
      )

      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        "test-variant",
        "test-region",
        2,
        {
          metadata: {},
          unit_price: undefined,
        }
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith({
        cart_id: cartId,
        title,
        variant_id: "test-variant",
      })

      expect(cartService.applyDiscount).toHaveBeenCalledTimes(0)
    })

    it("creates a draft order with a discount", async () => {
      const cartId = "test-cart"
      const title = "test-item"

      testOrder["discounts"] = [{ code: "TEST" }]
      await draftOrderService.create(testOrder)

      expect(draftOrderRepository.create).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.create).toHaveBeenCalledWith({
        cart_id: cartId,
      })

      expect(cartService.create).toHaveBeenCalledTimes(1)
      expect(cartService.create).toHaveBeenCalledWith({
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        type: "draft_order",
        discounts: testOrder.discounts,
      })

      expect(cartService.retrieve).toHaveBeenCalledTimes(1)
      expect(cartService.retrieve).toHaveBeenCalledWith("test-cart", {
        relations: ["discounts", "discounts.rule", "items", "region"],
      })

      expect(cartService.addShippingMethod).toHaveBeenCalledTimes(1)
      expect(cartService.addShippingMethod).toHaveBeenCalledWith(
        "test-cart",
        "test-option",
        {}
      )

      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        "test-variant",
        "test-region",
        2,
        {
          metadata: {},
          unit_price: undefined,
        }
      )

      expect(lineItemService.create).toHaveBeenCalledTimes(1)
      expect(lineItemService.create).toHaveBeenCalledWith({
        cart_id: cartId,
        title,
        variant_id: "test-variant",
      })

      expect(cartService.applyDiscount).toHaveBeenCalledTimes(1)
      expect(cartService.applyDiscount).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            expect.objectContaining({
              title,
              variant_id: testOrder.items[0].variant_id,
              cart_id: cartId,
            }),
          ],
          discounts: testOrder.discounts,
        }),
        testOrder.discounts[0].code
      )
    })

    it("fails on missing region", async () => {
      try {
        await draftOrderService.create({
          items: [],
        })
      } catch (error) {
        expect(error.message).toEqual(
          `region_id is required to create a draft order`
        )
      }
    })

    it("creating a draft order without items is allowed", async () => {
      await draftOrderService.create({
        region_id: "test-region",
        items: [],
        shipping_methods: [],
      })
    })
  })

  describe("update", () => {
    const testOrder = {
      region_id: "test-region",
      shipping_address_id: "test-shipping",
      billing_address_id: "test-billing",
      customer_id: "test-customer",
      items: [{ variant_id: "test-variant", quantity: 2, metadata: {} }],
      shipping_methods: [
        {
          option_id: "test-option",
          data: {},
        },
      ],
    }

    const completedOrder = {
      status: "completed",
      ...testOrder,
    }

    const draftOrderRepository = MockRepository({
      create: (d) => ({
        ...d,
      }),
      save: (d) => ({
        id: "test-draft-order",
        ...d,
      }),
      findOne: (q) => {
        switch (q.where.id) {
          case "completed":
            return Promise.resolve(completedOrder)
          default:
            return Promise.resolve(testOrder)
        }
      },
    })

    const draftOrderService = new DraftOrderService({
      manager: MockManager,
      regionService: undefined,
      cartService: undefined,
      shippingOptionService: undefined,
      lineItemService: undefined,
      lineItemAdjustmentService: LineItemAdjustmentServiceMock,
      productVariantService: undefined,
      draftOrderRepository,
      addressRepository: undefined,
      eventBusService: EventBusServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls draftOrder model functions", async () => {
      await draftOrderService.update("test-draft-order", {
        no_notification_order: true,
      })

      expect(draftOrderRepository.save).toHaveBeenCalledTimes(1)
      expect(draftOrderRepository.save).toHaveBeenCalledWith({
        no_notification_order: true,
        billing_address_id: "test-billing",
        customer_id: "test-customer",
        items: [
          {
            metadata: {},
            quantity: 2,
            variant_id: "test-variant",
          },
        ],
        region_id: "test-region",
        shipping_address_id: "test-shipping",
        shipping_methods: [
          {
            data: {},
            option_id: "test-option",
          },
        ],
      })
    })

    it("fails to update draftOrder when already complete", async () => {
      await expect(draftOrderService.update("completed", {})).rejects.toThrow(
        "Can't update a draft order which is complete"
      )
    })
  })
})
