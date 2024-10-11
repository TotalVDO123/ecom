import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  ProductEvents,
} from "@medusajs/framework/utils"

export const eventBuilders = {
  createdProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product",
    eventName: ProductEvents.PRODUCT_CREATED,
  }),
  updatedProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product",
    eventName: ProductEvents.PRODUCT_UPDATED,
  }),
  deletedProduct: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product",
    eventName: ProductEvents.PRODUCT_DELETED,
  }),
  createdProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_variant",
    eventName: ProductEvents.PRODUCT_VARIANT_CREATED,
  }),
  updatedProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_variant",
    eventName: ProductEvents.PRODUCT_VARIANT_UPDATED,
  }),
  deletedProductVariant: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_variant",
    eventName: ProductEvents.PRODUCT_VARIANT_DELETED,
  }),
  createdProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_option",
    eventName: ProductEvents.PRODUCT_OPTION_CREATED,
  }),
  updatedProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_option",
    eventName: ProductEvents.PRODUCT_OPTION_UPDATED,
  }),
  deletedProductOption: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_option",
    eventName: ProductEvents.PRODUCT_OPTION_DELETED,
  }),
  createdProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_type",
    eventName: ProductEvents.PRODUCT_TYPE_CREATED,
  }),
  updatedProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_type",
    eventName: ProductEvents.PRODUCT_TYPE_UPDATED,
  }),
  deletedProductType: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_type",
    eventName: ProductEvents.PRODUCT_TYPE_DELETED,
  }),
  createdProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_tag",
    eventName: ProductEvents.PRODUCT_TAG_CREATED,
  }),
  updatedProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_tag",
    eventName: ProductEvents.PRODUCT_TAG_UPDATED,
  }),
  deletedProductTag: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_tag",
    eventName: ProductEvents.PRODUCT_TAG_DELETED,
  }),
  createdProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_CREATED,
  }),
  updatedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_UPDATED,
  }),
  deletedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_DELETED,
  }),
}
