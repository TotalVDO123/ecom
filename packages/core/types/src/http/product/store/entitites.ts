import { StoreCollection } from "../../collection"
import { StoreProductCategory } from "../../product-category"
import { StoreProductType } from "../../product-type"
import {
  BaseProduct,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductVariant,
  ProductStatus,
} from "../common"

export interface StoreProduct extends Omit<BaseProduct, "categories"> {
  categories?: StoreProductCategory[] | null
  type?: StoreProductType | null
  collection?: StoreCollection | null
}
export interface StoreProductVariant extends BaseProductVariant {}
export interface StoreProductOption extends BaseProductOption {}
export interface StoreProductImage extends BaseProductImage {}
export interface StoreProductOptionValue extends BaseProductOptionValue {}
export type StoreProductStatus = ProductStatus
