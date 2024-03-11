import { FilterableServiceZoneProps, ServiceZoneDTO } from "./service-zone"
import { ShippingProfileDTO } from "./shipping-profile"
import { FulfillmentProviderDTO } from "./fulfillment-provider"
import {
  FilterableShippingOptionTypeProps,
  ShippingOptionTypeDTO,
} from "./shipping-option-type"
import {
  FilterableShippingOptionRuleProps,
  ShippingOptionRuleDTO,
} from "./shipping-option-rule"
import { BaseFilterable, OperatorMap } from "../../dal"
import { FulfillmentDTO } from "./fulfillment"

export type ShippingOptionPriceType = "calculated" | "flat"

export interface ShippingOptionDTO {
  id: string
  name: string
  price_type: ShippingOptionPriceType
  service_zone_id: string
  shipping_profile_id: string
  fulfillment_provider_id: string
  shipping_option_type_id: string | null
  data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  service_zone: ServiceZoneDTO
  shipping_profile: ShippingProfileDTO
  fulfillment_provider: FulfillmentProviderDTO
  type: ShippingOptionTypeDTO
  rules: ShippingOptionRuleDTO[]
  fulfillments: FulfillmentDTO[]
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableShippingOptionProps
  extends BaseFilterable<FilterableShippingOptionProps> {
  id?: string | string[] | OperatorMap<string | string[]>
  name?: string | string[] | OperatorMap<string | string[]>
  fulfillment_set_id?: string | string[] | OperatorMap<string | string[]>
  fulfillment_set_type?: string | string[] | OperatorMap<string | string[]>
  price_type?:
    | ShippingOptionPriceType
    | ShippingOptionPriceType[]
    | OperatorMap<ShippingOptionPriceType | ShippingOptionPriceType[]>
  service_zone?: FilterableServiceZoneProps
  shipping_option_type?: FilterableShippingOptionTypeProps
  rules?: FilterableShippingOptionRuleProps
  context?: Record<string, unknown>
}
