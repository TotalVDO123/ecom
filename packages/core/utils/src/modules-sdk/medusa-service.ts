/**
 * Utility factory and interfaces for module service public facing API
 */
import {
  Context,
  FindConfig,
  IEventBusModuleService,
  RepositoryService,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  isString,
  kebabCase,
  lowerCaseFirst,
  mapObjectTo,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"
import { InjectManager, MedusaContext } from "./decorators"
import { ModuleRegistrationName } from "./definition"
import {
  AbstractModuleService,
  BaseMethods,
  EntitiesConfigTemplate,
  ExtractKeysFromConfig,
  ModelConfigurationsToConfigTemplate,
  TEntityEntries,
} from "./types/medusa-service"
import { DmlEntity } from "../dml"

const readMethods = ["retrieve", "list", "listAndCount"] as BaseMethods[]
const writeMethods = [
  "delete",
  "softDelete",
  "restore",
  "create",
  "update",
] as BaseMethods[]

const methods: BaseMethods[] = [...readMethods, ...writeMethods]

/**
 * @internal
 */
function buildMethodNamesFromModel(
  modelName: string,
  model: TEntityEntries[keyof TEntityEntries]
): Record<string, string> {
  return methods.reduce((acc, method) => {
    let normalizedModelName: string = ""

    if (method === "retrieve") {
      normalizedModelName =
        "singular" in model && model.singular ? model.singular : modelName
    } else {
      normalizedModelName =
        "plural" in model && model.plural ? model.plural : pluralize(modelName)
    }

    const methodName = `${method}${upperCaseFirst(normalizedModelName)}`

    return { ...acc, [method]: methodName }
  }, {})
}

export const MedusaServiceDmlObjectSymbolFunction = Symbol.for(
  "MedusaServiceDmlObjectSymbolFunction"
)

export const MedusaServiceSymbol = Symbol.for("MedusaServiceSymbol")

/**
 * Check if a value is a Medusa service
 * @param value
 */
export function isMedusaService(
  value: any
): value is MedusaServiceReturnType<any> {
  return value && value?.prototype[MedusaServiceSymbol]
}

// TODO: rework that so the links are properly typed and used in the module exports.
// For now lets focus on the runtime part, please do not touch too much this part :)
type InferDmlFromConfig<T> = {
  [K in keyof T as T[K] extends { dml: any }
    ? K
    : K extends DmlEntity<any>
    ? K
    : never]: T[K] extends {
    dml: infer DML
  }
    ? DML extends DmlEntity<any>
      ? DML
      : never
    : T[K] extends DmlEntity<any>
    ? T[K]
    : never
}

export type MedusaServiceReturnType<EntitiesConfig extends Record<any, any>> = {
  new (...args: any[]): AbstractModuleService<EntitiesConfig>
  $dmlObjects: InferDmlFromConfig<EntitiesConfig>[keyof InferDmlFromConfig<EntitiesConfig>][]
}

/**
 * Factory function for creating an abstract module service
 *
 * @example
 *
 * // Here the DTO's and names will be inferred from the arguments
 *
 * const entities = {
 *   Currency,
 *   Price,
 *   PriceList,
 *   PriceListRule,
 *   PriceListRuleValue,
 *   PriceRule,
 *   PriceSetRuleType,
 *   RuleType,
 * }
 *
 * class MyService extends ModulesSdkUtils.MedusaService(entities, entityNameToLinkableKeysMap) {}
 *
 * @param entities
 * @param entityNameToLinkableKeysMap
 */
export function MedusaService<
  const EntitiesConfig extends EntitiesConfigTemplate = { __empty: any },
  const TEntities extends TEntityEntries<
    ExtractKeysFromConfig<EntitiesConfig>
  > = TEntityEntries<ExtractKeysFromConfig<EntitiesConfig>>
>(
  entities: TEntities,
  entityNameToLinkableKeysMap: MapToConfig = {}
): MedusaServiceReturnType<
  EntitiesConfig extends { __empty: any }
    ? ModelConfigurationsToConfigTemplate<TEntities>
    : EntitiesConfig
> {
  const buildAndAssignMethodImpl = function (
    klassPrototype: any,
    method: string,
    methodName: string,
    modelName: string
  ): void {
    const serviceRegistrationName = `${lowerCaseFirst(modelName)}Service`

    const applyMethod = function (impl: Function, contextIndex) {
      klassPrototype[methodName] = impl

      const descriptorMockRef = {
        value: klassPrototype[methodName],
      }

      MedusaContext()(klassPrototype, methodName, contextIndex)

      InjectManager("baseRepository_")(
        klassPrototype,
        methodName,
        descriptorMockRef
      )

      klassPrototype[methodName] = descriptorMockRef.value
    }

    let methodImplementation: any = function () {
      void 0
    }

    switch (method) {
      case "retrieve":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          id: string,
          config?: FindConfig<any>,
          sharedContext: Context = {}
        ): Promise<T> {
          const entities = await this.__container__[
            serviceRegistrationName
          ].retrieve(id, config, sharedContext)

          return await this.baseRepository_.serialize<T>(entities)
        }

        applyMethod(methodImplementation, 2)

        break
      case "create":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          data = [],
          sharedContext: Context = {}
        ): Promise<T | T[]> {
          const serviceData = Array.isArray(data) ? data : [data]
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.create(serviceData, sharedContext)
          const response = Array.isArray(data) ? entities : entities[0]

          return await this.baseRepository_.serialize<T | T[]>(response)
        }

        applyMethod(methodImplementation, 1)

        break
      case "update":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          data = [],
          sharedContext: Context = {}
        ): Promise<T | T[]> {
          const serviceData = Array.isArray(data) ? data : [data]
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.update(serviceData, sharedContext)
          const response = Array.isArray(data) ? entities : entities[0]

          return await this.baseRepository_.serialize<T | T[]>(response)
        }

        applyMethod(methodImplementation, 1)

        break
      case "list":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.list(filters, config, sharedContext)

          return await this.baseRepository_.serialize<T[]>(entities)
        }

        applyMethod(methodImplementation, 2)

        break
      case "listAndCount":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const [entities, count] = await this.__container__[
            serviceRegistrationName
          ].listAndCount(filters, config, sharedContext)

          return [await this.baseRepository_.serialize<T[]>(entities), count]
        }

        applyMethod(methodImplementation, 2)

        break
      case "delete":
        methodImplementation = async function (
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          sharedContext: Context = {}
        ): Promise<void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]
          await this.__container__[serviceRegistrationName].delete(
            primaryKeyValues_,
            sharedContext
          )

          await this.eventBusModuleService_?.emit(
            primaryKeyValues_.map((primaryKeyValue) => ({
              eventName: `${kebabCase(modelName)}.deleted`,
              data: isString(primaryKeyValue)
                ? { id: primaryKeyValue }
                : primaryKeyValue,
            }))
          )
        }

        applyMethod(methodImplementation, 1)

        break
      case "softDelete":
        methodImplementation = async function <T extends { id: string }>(
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          config: SoftDeleteReturn<string> = {},
          sharedContext: Context = {}
        ): Promise<Record<string, string[]> | void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]

          const [entities, cascadedEntitiesMap] = await this.__container__[
            serviceRegistrationName
          ].softDelete(primaryKeyValues_, sharedContext)

          const softDeletedEntities = await this.baseRepository_.serialize<T[]>(
            entities
          )

          await this.eventBusModuleService_?.emit(
            softDeletedEntities.map(({ id }) => ({
              eventName: `${kebabCase(modelName)}.deleted`,
              metadata: { source: "", action: "", object: "" },
              data: { id },
            }))
          )

          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          const mappedCascadedEntitiesMap = mapObjectTo(
            cascadedEntitiesMap,
            entityNameToLinkableKeysMap,
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
        }

        applyMethod(methodImplementation, 2)

        break
      case "restore":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          config: RestoreReturn<string> = {},
          sharedContext: Context = {}
        ): Promise<Record<string, string[]> | void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]

          const [_, cascadedEntitiesMap] = await this.__container__[
            serviceRegistrationName
          ].restore(primaryKeyValues_, sharedContext)

          let mappedCascadedEntitiesMap
          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          mappedCascadedEntitiesMap = mapObjectTo(
            cascadedEntitiesMap,
            entityNameToLinkableKeysMap,
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
        }

        applyMethod(methodImplementation, 2)

        break
    }
  }

  class AbstractModuleService_ {
    [MedusaServiceSymbol] = true

    static [MedusaServiceDmlObjectSymbolFunction] = Object.values(
      entities
    ) as unknown as MedusaServiceReturnType<
      EntitiesConfig extends { __empty: any }
        ? ModelConfigurationsToConfigTemplate<TEntities>
        : EntitiesConfig
    >["$dmlObjects"]

    readonly __container__: Record<any, any>
    readonly baseRepository_: RepositoryService
    readonly eventBusModuleService_: IEventBusModuleService;

    [key: string]: any

    constructor(container: Record<any, any>) {
      this.__container__ = container
      this.baseRepository_ = container.baseRepository

      const hasEventBusModuleService = Object.keys(this.__container__).find(
        (key) => key === ModuleRegistrationName.EVENT_BUS
      )

      this.eventBusModuleService_ = hasEventBusModuleService
        ? this.__container__.eventBusModuleService
        : undefined
    }

    protected async emitEvents_(groupedEvents) {
      if (!this.eventBusModuleService_ || !groupedEvents) {
        return
      }

      const promises: Promise<void>[] = []
      for (const group of Object.keys(groupedEvents)) {
        promises.push(this.eventBusModuleService_.emit(groupedEvents[group]))
      }

      await Promise.all(promises)
    }
  }

  /**
   * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
   */

  const entitiesMethods: [
    string,
    TEntities[keyof TEntities],
    Record<string, string>
  ][] = Object.entries(entities as {}).map(([name, config]) => [
    name,
    config as TEntities[keyof TEntities],
    buildMethodNamesFromModel(name, config as TEntities[keyof TEntities]),
  ])

  for (let [modelName, model, modelsMethods] of entitiesMethods) {
    Object.entries(modelsMethods).forEach(([method, methodName]) => {
      buildAndAssignMethodImpl(
        AbstractModuleService_.prototype,
        method,
        methodName,
        modelName
      )
    })
  }

  return AbstractModuleService_ as any
}
