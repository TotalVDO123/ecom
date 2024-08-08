import { GeoZoneType } from "../../../fulfillment"
import { AdminShippingOption } from "../../shipping-option"
import { AdminStockLocation } from "../../stock-locations"

export interface AdminGeoZone {
  id: string
  type: GeoZoneType
  country_code: string
  province_code: string | null
  city: string | null
  postal_expression: Record<string, unknown> | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminServiceZone {
  id: string
  name: string
  fulfillment_set_id: string
  fulfillment_set: AdminFulfillmentSet
  geo_zones: AdminGeoZone[]
  shipping_options: AdminShippingOption[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AdminFulfillmentSet {
  id: string
  name: string
  type: string
  location: AdminStockLocation
  service_zones: AdminServiceZone[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}
