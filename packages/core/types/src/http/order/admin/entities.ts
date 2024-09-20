import { AdminCustomer } from "../../customer"
import { AdminPaymentCollection } from "../../payment/admin"
import { AdminProduct, AdminProductVariant } from "../../product"
import { AdminRegionCountry } from "../../region"
import { AdminSalesChannel } from "../../sales-channel"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderChange,
  BaseOrderChangeAction,
  BaseOrderFulfillment,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "../common"

export interface AdminOrder extends BaseOrder {
  payment_collections: AdminPaymentCollection[]
  fulfillments?: BaseOrderFulfillment[]
  sales_channel?: AdminSalesChannel
  customer?: AdminCustomer
  shipping_address?: AdminOrderAddress | null
  billing_address?: AdminOrderAddress | null
}

export interface AdminOrderLineItem extends Omit<BaseOrderLineItem, "variant" | "product"> {
  variant?: AdminProductVariant
  product?: AdminProduct
}
export interface AdminOrderChange extends BaseOrderChange {}

export interface AdminOrderFulfillment extends BaseOrderFulfillment {}

export interface AdminOrderLineItem extends BaseOrderLineItem {}

export interface AdminOrderAddress extends BaseOrderAddress {
  country?: AdminRegionCountry
}

export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}

export interface AdminOrderPreview
  extends Omit<AdminOrder, "items" | "shipping_methods"> {
  return_requested_total: number
  order_change: BaseOrderChange
  items: (AdminOrderLineItem & { actions?: BaseOrderChangeAction[] })[]
  shipping_methods: (AdminOrderShippingMethod & {
    actions?: BaseOrderChangeAction[]
  })[]
}
