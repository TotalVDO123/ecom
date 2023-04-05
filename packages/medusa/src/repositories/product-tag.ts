import { In } from "typeorm"
import { ProductTag } from "../models/product-tag"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { Image } from "../models"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

type ProductTagSelector = Partial<ProductTag> & {
  q?: string
  discount_condition_id?: string
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductTag>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    discount_condition_id?: string
  }
}

export const ProductTagRepository = dataSource
  .getRepository(ProductTag)
  .extend({
    async insertBulk(
      data: QueryDeepPartialEntity<ProductTag>[]
    ): Promise<ProductTag[]> {
      const queryBuilder = this.createQueryBuilder()
        .insert()
        .into(ProductTag)
        .values(data)

      if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
        const rawImages = await queryBuilder.execute()
        return rawImages.generatedMaps.map((d) =>
          this.create(d)
        ) as ProductTag[]
      }

      const rawImages = await queryBuilder.returning("*").execute()
      return rawImages.generatedMaps.map((d) => this.create(d))
    },

    async listTagsByUsage(take = 10): Promise<ProductTag[]> {
      return await this.createQueryBuilder("pt")
        .leftJoin("product_tags", "pts", "pt.id = pts.product_tag_id")
        .select(["id", "COUNT(pts.product_tag_id) as usage_count", "value"])
        .groupBy("id")
        .orderBy("usage_count", "DESC")
        .limit(take)
        .getMany()
    },

    async upsertTags(tags: UpsertTagsInput): Promise<ProductTag[]> {
      const tagsValues = tags.map((tag) => tag.value)
      const existingTags = await this.find({
        where: {
          value: In(tagsValues),
        },
      })
      const existingTagsMap = new Map(
        existingTags.map<[string, ProductTag]>((tag) => [tag.value, tag])
      )

      const upsertedTags: ProductTag[] = []
      const tagsToCreate: QueryDeepPartialEntity<Image>[] = []

      for (const tag of tags) {
        const aTag = existingTagsMap.get(tag.value)
        if (aTag) {
          upsertedTags.push(aTag)
        } else {
          const newTag = this.create(tag)
          tagsToCreate.push(newTag as QueryDeepPartialEntity<Image>)
        }
      }

      if (tagsToCreate.length) {
        const newTags = await this.insertBulk(tagsToCreate)
        upsertedTags.push(...newTags)
      }

      return upsertedTags
    },

    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductTag>
    ) {
      return await this.createQueryBuilder("pt")
        .where(query.where)
        .setFindOptions(query)
        .innerJoin(
          "discount_condition_product_tag",
          "dc_pt",
          `dc_pt.product_tag_id = pt.id AND dc_pt.condition_id = :dcId`,
          { dcId: conditionId }
        )
        .getManyAndCount()
    },
  })

export default ProductTagRepository
