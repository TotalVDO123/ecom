import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { TransactionBaseService } from "../interfaces"
import { SalesChannel } from "../models"
import { SalesChannelRepository } from "../repositories/sales-channel"
import {
  ExtendedFindConfig,
  FindConfig,
  QuerySelector,
  Selector,
} from "../types/common"
import {
  CreateSalesChannelInput,
  ListSalesChannelInput,
  UpdateSalesChannelInput,
} from "../types/sales-channels"
import { buildQuery } from "../utils"
import EventBusService from "./event-bus"
import StoreService from "./store"
import { PostgresError } from "../utils/exception-formatter"
import { DefaultWithoutRelations } from "../repositories/product"
import salesChannels from "../loaders/feature-flags/sales-channels"

type InjectedDependencies = {
  salesChannelRepository: typeof SalesChannelRepository
  eventBusService: EventBusService
  manager: EntityManager
  storeService: StoreService
}

class SalesChannelService extends TransactionBaseService<SalesChannelService> {
  static Events = {
    UPDATED: "sales_channel.updated",
    CREATED: "sales_channel.created",
    DELETED: "sales_channel.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelRepository_: typeof SalesChannelRepository
  protected readonly eventBusService_: EventBusService
  protected readonly storeService_: StoreService

  constructor({
    salesChannelRepository,
    eventBusService,
    manager,
    storeService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.salesChannelRepository_ = salesChannelRepository
    this.eventBusService_ = eventBusService
    this.storeService_ = storeService
  }

  /**
   * Retrieve a SalesChannel by id
   *
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns a sales channel
   */
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannel> = {}
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      const query = buildQuery(
        {
          id: salesChannelId,
        },
        config
      )

      const salesChannel = await salesChannelRepo.findOne(query)

      if (!salesChannel) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Sales channel with id ${salesChannelId} was not found`
        )
      }

      return salesChannel
    })
  }

  /**
   * Lists sales channels based on the provided parameters and includes the count of
   * sales channels that match the query.
   * @return an array containing the sales channels as
   *   the first element and the total count of sales channels that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: QuerySelector<SalesChannel>,
    config: FindConfig<SalesChannel> = {
      skip: 0,
      take: 20,
    }
  ): Promise<[SalesChannel[], number]> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      const selector_ = { ...selector }
      let q: string | undefined
      if ("q" in selector_) {
        q = selector_.q
        delete selector_.q
      }

      const query = buildQuery(selector_, config)

      if (q) {
        return await salesChannelRepo.getFreeTextSearchResultsAndCount(q, query)
      }

      return await salesChannelRepo.findAndCount(query)
    })
  }

  /**
   * Creates a SalesChannel
   *
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns the created channel
   */
  async create(data: CreateSalesChannelInput): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (manager) => {
      const salesChannelRepo: SalesChannelRepository =
        manager.getCustomRepository(this.salesChannelRepository_)

      const salesChannel = salesChannelRepo.create(data)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(SalesChannelService.Events.CREATED, {
          id: salesChannel.id,
        })

      return await salesChannelRepo.save(salesChannel)
    })
  }

  async update(
    salesChannelId: string,
    data: UpdateSalesChannelInput
  ): Promise<SalesChannel | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo: SalesChannelRepository =
        transactionManager.getCustomRepository(this.salesChannelRepository_)

      const salesChannel = await this.retrieve(salesChannelId)

      for (const key of Object.keys(data)) {
        if (typeof data[key] !== `undefined`) {
          salesChannel[key] = data[key]
        }
      }

      const result = await salesChannelRepo.save(salesChannel)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(SalesChannelService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Deletes a sales channel from
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @param salesChannelId - the id of the sales channel to delete
   * @return Promise<void>
   */
  async delete(salesChannelId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const salesChannelRepo = transactionManager.getCustomRepository(
        this.salesChannelRepository_
      )

      const salesChannel = await this.retrieve(salesChannelId).catch(
        () => void 0
      )

      if (!salesChannel) {
        return
      }

      const store = await this.storeService_.retrieve({
        select: ["default_sales_channel_id"],
      })

      if (salesChannel.id === store?.default_sales_channel_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You cannot delete the default sales channel"
        )
      }

      await salesChannelRepo.softRemove(salesChannel)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(SalesChannelService.Events.DELETED, {
          id: salesChannelId,
        })
    })
  }

  /**
   * Creates a default sales channel, if this does not already exist.
   * @return the sales channel
   */
  async createDefault(): Promise<SalesChannel> {
    return this.atomicPhase_(async (transactionManager) => {
      const store = await this.storeService_
        .withTransaction(transactionManager)
        .retrieve({
          relations: ["default_sales_channel"],
        })

      if (store.default_sales_channel_id) {
        return store.default_sales_channel
      }

      const defaultSalesChannel = await this.create({
        description: "Created by Medusa",
        name: "Default Sales Channel",
        is_disabled: false,
      })

      await this.storeService_.withTransaction(transactionManager).update({
        default_sales_channel_id: defaultSalesChannel.id,
      })

      return defaultSalesChannel
    })
  }

  /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareListQuery_(
    selector: Selector<SalesChannel> & { q?: string },
    config: FindConfig<SalesChannel>
  ): {
    q?: string
    relations: (keyof SalesChannel)[]
    query: ExtendedFindConfig<SalesChannel, Selector<SalesChannel>>
  } {
    const selector_ = { ...selector }
    const config_ = { ...config }

    let q: string | undefined
    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery<Selector<SalesChannel>, SalesChannel>(
      selector_,
      config_
    )

    if (config_.relations && config_.relations.length > 0) {
      query.relations = config_.relations
    }

    if (config_.select && config_.select.length > 0) {
      query.select = config_.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query,
      relations: rels as (keyof SalesChannel)[],
      q,
    }
  }
}

export default SalesChannelService
