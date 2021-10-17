import { indexTypes } from "medusa-core-utils"
import { transformProduct } from "../utils/transform-product"

class ProductSearchSubscriber {
  constructor(
    { eventBusService, algoliaService, productService },
    options
  ) {
    this.eventBus_ = eventBusService

    this.algoliaService_ = algoliaService

    this.productService_ = productService

    this.productIndexName = productService.constructor.IndexName

    this.eventBus_.subscribe("product.created", this.handleProductCreation)

    this.eventBus_.subscribe("product.updated", this.handleProductUpdate)

    this.eventBus_.subscribe("product.deleted", this.handleProductDeletion)

    this.eventBus_.subscribe(
      "product-variant.created",
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      "product-variant.updated",
      this.handleProductVariantChange
    )

    this.eventBus_.subscribe(
      "product-variant.deleted",
      this.handleProductVariantChange
    )
  }

  handleProductCreation = async (data) => {
    const product = await this.retrieveProduct_(data.id)
    await this.algoliaService_.addDocuments(
      this.productIndexName,
      [product],
      indexTypes.products
    )
  }

  retrieveProduct_ = async (product_id) => {
    const product = await this.productService_.retrieve(product_id, {
      select: [
        "id",
        "title",
        "subtitle",
        "description",
        "handle",
        "is_giftcard",
        "discountable",
        "thumbnail",
        "profile_id",
        "collection_id",
        "type_id",
        "origin_country",
        "created_at",
        "updated_at",
      ],
      relations: [
        "variants",
        "tags",
        "type",
        "collection",
        "variants.prices",
        "variants.options",
        "options",
      ],
    })
    const transformedProduct = transformProduct(product)
    return transformedProduct
  }

  handleProductUpdate = async (data) => {
    const product = await this.retrieveProduct_(data.id)
    await this.algoliaService_.addDocuments(
      this.productIndexName,
      [product],
      indexTypes.products
    )
  }

  handleProductDeletion = async (data) => {
    await this.algoliaService_.deleteDocument(
      this.productIndexName,
      data.id
    )
  }

  handleProductVariantChange = async (data) => {
    const product = await this.retrieveProduct_(data.product_id)
    await this.algoliaService_.addDocuments(
      this.productIndexName,
      [product],
      indexTypes.products
    )
  }
}

export default ProductSearchSubscriber
