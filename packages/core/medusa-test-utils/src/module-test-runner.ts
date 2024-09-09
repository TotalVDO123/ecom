import {
  ContainerRegistrationKeys,
  loadModels,
  ModulesSdkUtils,
  normalizeImportPathWithSource,
  toMikroOrmEntities,
} from "@medusajs/utils"
import { getDatabaseURL, getMikroOrmWrapper, TestDatabase } from "./database"
import { initModules, InitModulesOptions } from "./init-modules"
import { default as MockEventBusService } from "./mock-event-bus-service"
import * as fs from "fs"

export interface SuiteOptions<TService = unknown> {
  MikroOrmWrapper: TestDatabase
  medusaApp: any
  service: TService
  dbConfig: {
    schema: string
    clientUrl: string
  }
}

export function moduleIntegrationTestRunner<TService = any>({
  moduleName,
  moduleModels,
  moduleOptions = {},
  joinerConfig = [],
  schema = "public",
  debug = false,
  testSuite,
  resolve,
  injectedDependencies = {},
}: {
  moduleName: string
  moduleModels?: any[]
  moduleOptions?: Record<string, any>
  joinerConfig?: any[]
  schema?: string
  dbName?: string
  injectedDependencies?: Record<string, any>
  resolve?: string
  debug?: boolean
  testSuite: (options: SuiteOptions<TService>) => void
}) {
  const moduleSdkImports = require("@medusajs/modules-sdk")

  process.env.LOG_LEVEL = "error"

  if (!moduleModels) {
    const basePath = normalizeImportPathWithSource(resolve ?? process.cwd())

    const modelsPath = fs.existsSync(`${basePath}/src/models`)
      ? "/src/models"
      : fs.existsSync(`${basePath}/dist/models`)
      ? "/dist/models"
      : fs.existsSync(`${basePath}/models`)
      ? "/models"
      : ""

    if (modelsPath) {
      moduleModels = loadModels(`${basePath}${modelsPath}`)
      moduleModels = toMikroOrmEntities(moduleModels)
    } else {
      moduleModels = []
    }
  }

  const tempName = parseInt(process.env.JEST_WORKER_ID || "1")
  const dbName = `medusa-${moduleName.toLowerCase()}-integration-${tempName}`

  const dbConfig = {
    clientUrl: getDatabaseURL(dbName),
    schema,
    debug,
  }

  // Use a unique connection for all the entire suite
  const connection = ModulesSdkUtils.createPgConnection(dbConfig)

  const MikroOrmWrapper = getMikroOrmWrapper({
    mikroOrmEntities: moduleModels,
    clientUrl: dbConfig.clientUrl,
    schema: dbConfig.schema,
  })

  const modulesConfig_ = {
    [moduleName]: {
      definition: moduleSdkImports.ModulesDefinition[moduleName],
      resolve,
      options: {
        database: dbConfig,
        ...moduleOptions,
      },
    },
  }

  const moduleOptions_: InitModulesOptions = {
    injectedDependencies: {
      [ContainerRegistrationKeys.PG_CONNECTION]: connection,
      eventBusModuleService: new MockEventBusService(),
      [ContainerRegistrationKeys.LOGGER]: console,
      ...injectedDependencies,
    },
    modulesConfig: modulesConfig_,
    databaseConfig: dbConfig,
    joinerConfig,
    preventConnectionDestroyWarning: true,
  }

  let shutdown: () => Promise<void>
  let moduleService
  let medusaApp = {}

  const options = {
    MikroOrmWrapper,
    medusaApp: new Proxy(
      {},
      {
        get: (target, prop) => {
          return medusaApp[prop]
        },
      }
    ),
    service: new Proxy(
      {},
      {
        get: (target, prop) => {
          return moduleService[prop]
        },
      }
    ),
    dbConfig: {
      schema,
      clientUrl: dbConfig.clientUrl,
    },
  } as SuiteOptions<TService>

  const beforeEach_ = async () => {
    if (moduleModels.length) {
      await MikroOrmWrapper.setupDatabase()
    }
    const output = await initModules(moduleOptions_)
    shutdown = output.shutdown
    medusaApp = output.medusaApp
    moduleService = output.medusaApp.modules[moduleName]
  }

  const afterEach_ = async () => {
    if (moduleModels.length) {
      await MikroOrmWrapper.clearDatabase()
    }
    await shutdown()
    moduleService = {}
    medusaApp = {}
  }

  return describe("", () => {
    beforeEach(beforeEach_)
    afterEach(afterEach_)
    afterAll(async () => {
      await (connection as any).context?.destroy()
      await (connection as any).destroy()
    })

    testSuite(options)
  })
}
