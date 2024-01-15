import { DAL, PromotionTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Promotion } from "@models"
import { CreatePromotionDTO, UpdatePromotionDTO } from "../types"

type InjectedDependencies = {
  promotionRepository: DAL.RepositoryService
}

export default class PromotionService<
  TEntity extends Promotion = Promotion
> extends ModulesSdkUtils.abstractServiceFactory<
  Promotion,
  InjectedDependencies,
  {
    retrieve: PromotionTypes.PromotionDTO
    list: PromotionTypes.PromotionDTO
    listAndCount: PromotionTypes.PromotionDTO
    create: CreatePromotionDTO
    update: UpdatePromotionDTO
  },
  {
    list: PromotionTypes.FilterablePromotionProps
    listAndCount: PromotionTypes.FilterablePromotionProps
  }
>(Promotion) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
