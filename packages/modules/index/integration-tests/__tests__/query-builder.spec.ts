import { Catalog, CatalogRelation } from "@models"
import { IndexTypes } from "@medusajs/types"
import { dbTestUtilFactory } from "medusa-test-utils"
import { initDb } from "medusa-test-utils/dist/medusa-test-runner-utils/use-db"
import { dbName } from "../__fixtures__/medusa-config"
import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
} from "@medusajs/framework"
import path from "path"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { asValue } from "awilix"
import { MedusaAppOutput, MedusaModule } from "@medusajs/modules-sdk"
import { EventBusServiceMock } from "../__fixtures__"
import { EntityManager } from "@mikro-orm/postgresql"

const eventBusMock = new EventBusServiceMock()
const remoteQueryMock = jest.fn()
const dbUtils = dbTestUtilFactory()

jest.setTimeout(300000)

let isFirstTime = true
let medusaAppLoader!: MedusaAppLoader

const beforeAll_ = async () => {
  try {
    configLoader(path.join(__dirname, "./../__fixtures__"), "medusa-config.js")

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(null),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader(container as any)

    // Migrations
    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()

    const index = container.resolve("indexService")

    // Mock event bus  the index module
    ;(index as any).eventBusModuleService_ = eventBusMock

    await globalApp.onApplicationStart()

    jest
      .spyOn((index as any).storageProvider_, "remoteQuery_")
      .mockImplementation(remoteQueryMock)

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

const beforeEach_ = async () => {
  jest.clearAllMocks()

  if (isFirstTime) {
    isFirstTime = false
    return
  }

  try {
    await medusaAppLoader.runModulesLoader()
  } catch (error) {
    console.error("Error runner modules loaders", error?.message)
    throw error
  }
}

const afterEach_ = async () => {
  try {
    await dbUtils.teardown({ schema: "public" })
  } catch (error) {
    console.error("Error tearing down database:", error?.message)
    throw error
  }
}

describe("SearchEngineModuleService query", function () {
  let medusaApp: MedusaAppOutput
  let module: IndexTypes.IIndexService
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    await beforeEach_()

    module = medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX)

    const manager = (
      (medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX) as any)
        .container_.manager as EntityManager
    ).fork()

    const catalogRepository = manager.getRepository(Catalog)

    await manager.persistAndFlush(
      [
        {
          id: "prod_1",
          name: "Product",
          data: {
            id: "prod_1",
          },
        },
        {
          id: "prod_2",
          name: "Product",
          data: {
            id: "prod_2",
            title: "Product 2 title",
            deep: {
              a: 1,
              obj: {
                b: 15,
              },
            },
          },
        },
        {
          id: "var_1",
          name: "ProductVariant",
          data: {
            id: "var_1",
            sku: "aaa test aaa",
          },
        },
        {
          id: "var_2",
          name: "ProductVariant",
          data: {
            id: "var_2",
            sku: "sku 123",
          },
        },
        {
          id: "link_id_1",
          name: "LinkProductVariantPriceSet",
          data: {
            id: "link_id_1",
            variant_id: "var_1",
            price_set_id: "price_set_1",
          },
        },
        {
          id: "link_id_2",
          name: "LinkProductVariantPriceSet",
          data: {
            id: "link_id_2",
            variant_id: "var_2",
            price_set_id: "price_set_2",
          },
        },
        {
          id: "price_set_1",
          name: "PriceSet",
          data: {
            id: "price_set_1",
          },
        },
        {
          id: "price_set_2",
          name: "PriceSet",
          data: {
            id: "price_set_2",
          },
        },
        {
          id: "money_amount_1",
          name: "Price",
          data: {
            id: "money_amount_1",
            amount: 100,
          },
        },
        {
          id: "money_amount_2",
          name: "Price",
          data: {
            id: "money_amount_2",
            amount: 10,
          },
        },
      ].map((data) => catalogRepository.create(data))
    )

    const catalogRelationRepository = manager.getRepository(CatalogRelation)

    await manager.persistAndFlush(
      [
        {
          parent_id: "prod_1",
          parent_name: "Product",
          child_id: "var_1",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        },
        {
          parent_id: "prod_1",
          parent_name: "Product",
          child_id: "var_2",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        },
        {
          parent_id: "var_1",
          parent_name: "ProductVariant",
          child_id: "link_id_1",
          child_name: "LinkProductVariantPriceSet",
          pivot: "ProductVariant-LinkProductVariantPriceSet",
        },
        {
          parent_id: "var_2",
          parent_name: "ProductVariant",
          child_id: "link_id_2",
          child_name: "LinkProductVariantPriceSet",
          pivot: "ProductVariant-LinkProductVariantPriceSet",
        },
        {
          parent_id: "link_id_1",
          parent_name: "LinkProductVariantPriceSet",
          child_id: "price_set_1",
          child_name: "PriceSet",
          pivot: "LinkProductVariantPriceSet-PriceSet",
        },
        {
          parent_id: "link_id_2",
          parent_name: "LinkProductVariantPriceSet",
          child_id: "price_set_2",
          child_name: "PriceSet",
          pivot: "LinkProductVariantPriceSet-PriceSet",
        },
        {
          parent_id: "price_set_1",
          parent_name: "PriceSet",
          child_id: "money_amount_1",
          child_name: "Price",
          pivot: "PriceSet-Price",
        },
        {
          parent_id: "price_set_2",
          parent_name: "PriceSet",
          child_id: "money_amount_2",
          child_name: "Price",
          pivot: "PriceSet-Price",
        },
      ].map((data) => catalogRelationRepository.create(data))
    )
  })

  afterEach(afterEach_)

  it("should query all products ordered by sku DESC", async () => {
    const [result, count] = await module.queryAndCount(
      {
        select: {
          product: {
            variants: {
              prices: true,
            },
          },
        },
      },
      {
        orderBy: [{ "product.variants.sku": "DESC" }],
      }
    )

    expect(count).toEqual(2)
    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
      {
        id: "prod_1",
        variants: [
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },

          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering by variant sku", async () => {
    const result = await module.query({
      select: {
        product: {
          variants: {
            prices: true,
          },
        },
      },
      where: {
        "product.variants.sku": { $like: "aaa%" },
      },
    })

    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query products filtering by price and returning the complete entity", async () => {
    const [result] = await module.queryAndCount(
      {
        select: {
          product: {
            variants: {
              prices: true,
            },
          },
        },
        where: {
          "product.variants.prices.amount": { $gt: "50" },
        },
      },
      {
        keepFilteredEntities: true,
      }
    )
    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
    ])
  })

  it("should query all products", async () => {
    const [result, count] = await module.queryAndCount({
      select: {
        product: {
          variants: {
            prices: true,
          },
        },
      },
    })

    expect(count).toEqual(2)
    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
            sku: "aaa test aaa",
            prices: [
              {
                id: "money_amount_1",
                amount: 100,
              },
            ],
          },
          {
            id: "var_2",
            sku: "sku 123",
            prices: [
              {
                id: "money_amount_2",
                amount: 10,
              },
            ],
          },
        ],
      },
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should paginate products", async () => {
    const result = await module.query(
      {
        select: {
          product: {
            variants: {
              prices: true,
            },
          },
        },
      },
      {
        take: 1,
        skip: 1,
      }
    )

    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should handle null values on where clause", async () => {
    const result = await module.query({
      select: {
        product: {
          variants: {
            prices: true,
          },
        },
      },
      where: {
        "product.variants.sku": null,
      },
    })

    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
        variants: [],
      },
    ])
  })

  it("should query products filtering by deep nested levels", async () => {
    const [result] = await module.queryAndCount({
      select: {
        product: true,
      },
      where: {
        "product.deep.obj.b": 15,
      },
    })
    expect(result).toEqual([
      {
        id: "prod_2",
        title: "Product 2 title",
        deep: {
          a: 1,
          obj: {
            b: 15,
          },
        },
      },
    ])
  })
})
