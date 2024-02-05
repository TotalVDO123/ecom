import { MedusaModule, Modules } from "@medusajs/modules-sdk"
import {
  IProductModuleService,
  ProductTypes,
  UpdateProductDTO,
} from "@medusajs/types"
import { kebabCase } from "@medusajs/utils"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductType,
  ProductVariant,
} from "@models"

import { initModules } from "medusa-test-utils"
import { initialize } from "../../../../src"
import { EventBusService } from "../../../__fixtures__/event-bus"
import { createCollections, createTypes } from "../../../__fixtures__/product"
import { createProductCategories } from "../../../__fixtures__/product-category"
import { buildProductAndRelationsData } from "../../../__fixtures__/product/data/create-product"
import { DB_URL, TestDatabase, getInitModuleConfig } from "../../../utils"

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
  jest.clearAllMocks()
}

describe("ProductModuleService products", function () {
  let productCollectionOne: ProductCollection
  let productCollectionTwo: ProductCollection

  const productCollectionsData = [
    {
      id: "test-1",
      title: "col 1",
    },
    {
      id: "test-2",
      title: "col 2",
    },
  ]

  describe("update", function () {
    let module: IProductModuleService
    let productOne: Product
    let productTwo: Product
    let productCategoryOne: ProductCategory
    let productCategoryTwo: ProductCategory
    let variantOne: ProductVariant
    let variantTwo: ProductVariant
    let variantThree: ProductVariant
    let productTypeOne: ProductType
    let productTypeTwo: ProductType
    let images = ["image-1"]

    const productCategoriesData = [
      {
        id: "test-1",
        name: "category 1",
      },
      {
        id: "test-2",
        name: "category 2",
      },
    ]

    const productTypesData = [
      {
        id: "type-1",
        value: "type 1",
      },
      {
        id: "type-2",
        value: "type 2",
      },
    ]

    const tagsData = [
      {
        id: "tag-1",
        value: "tag 1",
      },
    ]

    let shutdownFunc: () => Promise<void>

    beforeAll(async () => {
      MedusaModule.clearInstances()

      const initModulesConfig = getInitModuleConfig()

      const { medusaApp, shutdown } = await initModules(initModulesConfig)

      module = medusaApp.modules[Modules.PRODUCT]

      shutdownFunc = shutdown
    })

    afterAll(async () => {
      await shutdownFunc()
    })

    beforeEach(async () => {
      const testManager = await beforeEach_()

      const collections = await createCollections(
        testManager,
        productCollectionsData
      )

      productCollectionOne = collections[0]
      productCollectionTwo = collections[1]

      const types = await createTypes(testManager, productTypesData)

      productTypeOne = types[0]
      productTypeTwo = types[1]

      const categories = await createProductCategories(
        testManager,
        productCategoriesData
      )

      productCategoryOne = categories[0]
      productCategoryTwo = categories[1]

      productOne = testManager.create(Product, {
        id: "product-1",
        title: "product 1",
        status: ProductTypes.ProductStatus.PUBLISHED,
      })

      productTwo = testManager.create(Product, {
        id: "product-2",
        title: "product 2",
        status: ProductTypes.ProductStatus.PUBLISHED,
        categories: [productCategoryOne],
        collection_id: productCollectionOne.id,
        tags: tagsData,
      })

      variantOne = testManager.create(ProductVariant, {
        id: "variant-1",
        title: "variant 1",
        inventory_quantity: 10,
        product: productOne,
      })

      variantTwo = testManager.create(ProductVariant, {
        id: "variant-2",
        title: "variant 2",
        inventory_quantity: 10,
        product: productTwo,
      })

      variantThree = testManager.create(ProductVariant, {
        id: "variant-3",
        title: "variant 3",
        inventory_quantity: 10,
        product: productTwo,
      })

      await testManager.persistAndFlush([productOne, productTwo])
    })

    afterEach(afterEach_)

    it("should update a product and upsert relations that are not created yet", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const variantTitle = data.variants[0].title

      const productBefore = (await module.retrieve(productOne.id, {
        relations: [
          "images",
          "variants",
          "options",
          "options.values",
          "variants.options",
          "tags",
          "type",
        ],
      })) as unknown as UpdateProductDTO

      productBefore.title = "updated title"
      productBefore.variants = [...productBefore.variants!, ...data.variants]
      productBefore.type = { value: "new-type" }
      productBefore.options = data.options
      productBefore.images = data.images
      productBefore.thumbnail = data.thumbnail
      productBefore.tags = data.tags

      const updatedProducts = await module.update([productBefore])
      expect(updatedProducts).toHaveLength(1)

      const product = await module.retrieve(productBefore.id, {
        relations: [
          "images",
          "variants",
          "options",
          "options.values",
          "variants.options",
          "tags",
          "type",
        ],
      })

      const createdVariant = product.variants.find(
        (v) => v.title === variantTitle
      )!

      expect(product.images).toHaveLength(1)
      expect(createdVariant?.options).toHaveLength(1)
      expect(product.tags).toHaveLength(1)
      expect(product.variants).toHaveLength(2)

      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: "updated title",
          description: productBefore.description,
          subtitle: productBefore.subtitle,
          is_giftcard: productBefore.is_giftcard,
          discountable: productBefore.discountable,
          thumbnail: images[0],
          status: productBefore.status,
          images: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: images[0],
            }),
          ]),
          options: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: productBefore.options?.[0].title,
              values: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: createdVariant.options?.[0].value,
                }),
              ]),
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              value: productBefore.tags?.[0].value,
            }),
          ]),
          type: expect.objectContaining({
            id: expect.any(String),
            value: productBefore.type!.value,
          }),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: createdVariant.title,
              sku: createdVariant.sku,
              allow_backorder: false,
              manage_inventory: true,
              inventory_quantity: 100,
              variant_rank: 0,
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: createdVariant.options?.[0].value,
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("should emit events through event bus", async () => {
      const eventBusSpy = jest.spyOn(EventBusService.prototype, "emit")
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const updateData = {
        ...data,
        id: productOne.id,
        title: "updated title",
      }

      await module.update([updateData])

      expect(eventBusSpy).toHaveBeenCalledTimes(1)
      expect(eventBusSpy).toHaveBeenCalledWith([
        {
          eventName: "product.updated",
          data: { id: productOne.id },
        },
      ])
    })

    it("should add relationships to a product", async () => {
      const updateData = {
        id: productOne.id,
        categories: [
          {
            id: productCategoryOne.id,
          },
        ],
        collection_id: productCollectionOne.id,
        type_id: productTypeOne.id,
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "type"],
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productOne.id,
          categories: [
            expect.objectContaining({
              id: productCategoryOne.id,
            }),
          ],
          collection: expect.objectContaining({
            id: productCollectionOne.id,
          }),
          type: expect.objectContaining({
            id: productTypeOne.id,
          }),
        })
      )
    })

    it("should upsert a product type when type object is passed", async () => {
      let updateData = {
        id: productTwo.id,
        type: {
          id: productTypeOne.id,
          value: productTypeOne.value,
        },
      }

      await module.update([updateData])

      let product = await module.retrieve(updateData.id, {
        relations: ["type"],
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          type: expect.objectContaining({
            id: productTypeOne.id,
          }),
        })
      )

      updateData = {
        id: productTwo.id,
        type: {
          id: "new-type-id",
          value: "new-type-value",
        },
      }

      await module.update([updateData])

      product = await module.retrieve(updateData.id, {
        relations: ["type"],
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          type: expect.objectContaining({
            ...updateData.type,
          }),
        })
      )
    })

    it("should replace relationships of a product", async () => {
      const newTagData = {
        id: "tag-2",
        value: "tag 2",
      }

      const updateData = {
        id: productTwo.id,
        categories: [
          {
            id: productCategoryTwo.id,
          },
        ],
        collection_id: productCollectionTwo.id,
        type_id: productTypeTwo.id,
        tags: [newTagData],
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "tags", "type"],
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          categories: [
            expect.objectContaining({
              id: productCategoryTwo.id,
            }),
          ],
          collection: expect.objectContaining({
            id: productCollectionTwo.id,
          }),
          tags: [
            expect.objectContaining({
              id: newTagData.id,
              value: newTagData.value,
            }),
          ],
          type: expect.objectContaining({
            id: productTypeTwo.id,
          }),
        })
      )
    })

    it("should remove relationships of a product", async () => {
      const updateData = {
        id: productTwo.id,
        categories: [],
        collection_id: null,
        type_id: null,
        tags: [],
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["categories", "collection", "tags"],
      })

      expect(product).toEqual(
        expect.objectContaining({
          id: productTwo.id,
          categories: [],
          tags: [],
          collection: null,
          type: null,
        })
      )
    })

    it("should throw an error when product ID does not exist", async () => {
      let error
      const updateData = {
        id: "does-not-exist",
        title: "test",
      }

      try {
        await module.update([updateData])
      } catch (e) {
        error = e.message
      }

      expect(error).toEqual(`Product with id "does-not-exist" not found`)
    })

    it("should update, create and delete variants", async () => {
      const updateData = {
        id: productTwo.id,
        // Note: VariantThree is already assigned to productTwo, that should be deleted
        variants: [
          {
            id: variantTwo.id,
            title: "updated-variant",
          },
          {
            title: "created-variant",
          },
        ],
      }

      await module.update([updateData])

      const product = await module.retrieve(updateData.id, {
        relations: ["variants"],
      })

      expect(product.variants).toHaveLength(2)
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: variantTwo.id,
              title: "updated-variant",
            }),
            expect.objectContaining({
              id: expect.any(String),
              title: "created-variant",
            }),
          ]),
        })
      )
    })

    it("should throw an error when variant with id does not exist", async () => {
      let error

      const updateData = {
        id: productTwo.id,
        // Note: VariantThree is already assigned to productTwo, that should be deleted
        variants: [
          {
            id: "does-not-exist",
            title: "updated-variant",
          },
          {
            title: "created-variant",
          },
        ],
      }

      try {
        await module.update([updateData])
      } catch (e) {
        error = e
      }

      await module.retrieve(updateData.id, {
        relations: ["variants"],
      })

      expect(error.message).toEqual(
        `ProductVariant with id "does-not-exist" not found`
      )
    })
  })

  describe("create", function () {
    let module: IProductModuleService
    let images = ["image-1"]
    let eventBus

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      eventBus = new EventBusService()
      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it.only("should create a product", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const productsCreated = await module.create([data])

      const products = await module.list(
        { id: productsCreated[0].id },
        {
          relations: [
            "images",
            "categories",
            "variants",
            "variants.options",
            "options",
            "options.values",
            "tags",
            "type",
          ],
        }
      )

      expect(products).toHaveLength(1)
      expect(products[0].images).toHaveLength(1)
      expect(products[0].options).toHaveLength(1)
      expect(products[0].tags).toHaveLength(1)
      expect(products[0].categories).toHaveLength(0)
      expect(products[0].variants).toHaveLength(1)

      expect(products[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: data.title,
          handle: kebabCase(data.title),
          description: data.description,
          subtitle: data.subtitle,
          is_giftcard: data.is_giftcard,
          discountable: data.discountable,
          thumbnail: images[0],
          status: data.status,
          images: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: images[0],
            }),
          ]),
          options: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: data.options[0].title,
              values: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: data.variants[0].options?.[0].value,
                }),
              ]),
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              value: data.tags[0].value,
            }),
          ]),
          type: expect.objectContaining({
            id: expect.any(String),
            value: data.type.value,
          }),
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: data.variants[0].title,
              sku: data.variants[0].sku,
              allow_backorder: false,
              manage_inventory: true,
              inventory_quantity: 100,
              variant_rank: 0,
              options: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  value: data.variants[0].options?.[0].value,
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("should emit events through eventBus", async () => {
      const eventBusSpy = jest.spyOn(EventBusService.prototype, "emit")
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      expect(eventBusSpy).toHaveBeenCalledTimes(1)
      expect(eventBusSpy).toHaveBeenCalledWith([
        {
          eventName: "product.created",
          data: { id: products[0].id },
        },
      ])
    })
  })

  describe("softDelete", function () {
    let module: IProductModuleService
    let images = ["image-1"]
    let eventBus

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      eventBus = new EventBusService()
      module = await initialize(
        {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        {
          eventBusModuleService: eventBus,
        }
      )
    })

    afterEach(afterEach_)

    it("should soft delete a product and its cascaded relations", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      await module.softDelete([products[0].id])

      const deletedProducts = await module.list(
        { id: products[0].id },
        {
          relations: [
            "variants",
            "variants.options",
            "options",
            "options.values",
          ],
          withDeleted: true,
        }
      )

      expect(deletedProducts).toHaveLength(1)
      expect(deletedProducts[0].deleted_at).not.toBeNull()

      for (const option of deletedProducts[0].options) {
        expect(option.deleted_at).not.toBeNull()
      }

      const productOptionsValues = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const optionValue of productOptionsValues) {
        expect(optionValue.deleted_at).not.toBeNull()
      }

      for (const variant of deletedProducts[0].variants) {
        expect(variant.deleted_at).not.toBeNull()
      }

      const variantsOptions = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const option of variantsOptions) {
        expect(option.deleted_at).not.toBeNull()
      }
    })

    it("should emit events through eventBus", async () => {
      const eventBusSpy = jest.spyOn(EventBusService.prototype, "emit")
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      await module.softDelete([products[0].id])

      expect(eventBusSpy).toHaveBeenCalledWith([
        {
          eventName: "product.created",
          data: { id: products[0].id },
        },
      ])
    })
  })

  describe("restore", function () {
    let module: IProductModuleService
    let images = ["image-1"]

    beforeEach(async () => {
      await beforeEach_()

      MedusaModule.clearInstances()

      module = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
        },
      })
    })

    afterEach(afterEach_)

    it("should restore a soft deleted product and its cascaded relations", async () => {
      const data = buildProductAndRelationsData({
        images,
        thumbnail: images[0],
      })

      const products = await module.create([data])

      let retrievedProducts = await module.list({ id: products[0].id })

      expect(retrievedProducts).toHaveLength(1)
      expect(retrievedProducts[0].deleted_at).toBeNull()

      await module.softDelete([products[0].id])

      retrievedProducts = await module.list(
        { id: products[0].id },
        {
          withDeleted: true,
        }
      )

      expect(retrievedProducts).toHaveLength(1)
      expect(retrievedProducts[0].deleted_at).not.toBeNull()

      await module.restore([products[0].id])

      const deletedProducts = await module.list(
        { id: products[0].id },
        {
          relations: [
            "variants",
            "variants.options",
            "variants.options",
            "options",
            "options.values",
          ],
          withDeleted: true,
        }
      )

      expect(deletedProducts).toHaveLength(1)
      expect(deletedProducts[0].deleted_at).toBeNull()

      for (const option of deletedProducts[0].options) {
        expect(option.deleted_at).toBeNull()
      }

      const productOptionsValues = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const optionValue of productOptionsValues) {
        expect(optionValue.deleted_at).toBeNull()
      }

      for (const variant of deletedProducts[0].variants) {
        expect(variant.deleted_at).toBeNull()
      }

      const variantsOptions = deletedProducts[0].options
        .map((o) => o.values)
        .flat()

      for (const option of variantsOptions) {
        expect(option.deleted_at).toBeNull()
      }
    })
  })

  describe("list", function () {
    let module: IProductModuleService
    let collections: ProductCollection

    beforeEach(async () => {
      const testManager = await beforeEach_()

      const collections = await createCollections(
        testManager,
        productCollectionsData
      )

      productCollectionOne = collections[0]
      productCollectionTwo = collections[1]

      MedusaModule.clearInstances()

      module = await initialize({
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
        },
      })

      const productOneData = buildProductAndRelationsData({
        collection_id: productCollectionOne.id,
      })

      const productTwoData = buildProductAndRelationsData({
        collection_id: productCollectionTwo.id,
      })

      await module.create([productOneData, productTwoData])
    })

    afterEach(afterEach_)

    it("should return a list of products scoped by collection id", async () => {
      const productsWithCollectionOne = await module.list(
        { collection_id: productCollectionOne.id },
        {
          relations: ["collection"],
        }
      )

      expect(productsWithCollectionOne).toHaveLength(1)

      expect([
        expect.objectContaining({
          collection: expect.objectContaining({
            id: productCollectionOne.id,
          }),
        }),
      ])
    })

    it("should returns empty array when querying for a collection that doesnt exist", async () => {
      const products = await module.list(
        {
          categories: { id: ["collection-doesnt-exist-id"] },
        },
        {
          select: ["title", "collection.title"],
          relations: ["collection"],
        }
      )

      expect(products).toEqual([])
    })
  })
})
