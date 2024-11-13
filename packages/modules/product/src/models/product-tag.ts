import { model } from "@medusajs/framework/utils"
import Product from "./product"

const tagValueIndexName = "IDX_tag_value_unique"
// const tagValueIndexStatement = createPsqlIndexStatementHelper({
//   name: tagValueIndexName,
//   tableName: "product_tag",
//   columns: ["value"],
//   unique: true,
//   where: "deleted_at IS NULL",
// })

const ProductTagDML = model
  .define("ProductTag", {
    id: model.id().primaryKey(),
    value: model.text().searchable(),
    metadata: model.json().nullable(),
    product: model.manyToMany(() => Product, {
      mappedBy: "tags",
    }),
  })
  .indexes([
    {
      name: tagValueIndexName,
      on: ["value"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

// tagValueIndexStatement.MikroORMIndex()
// @Entity({ tableName: "product_tag" })
// @Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
// class ProductTag {
// @PrimaryKey({ columnType: "text" })
// id!: string
// @Searchable()
// @Property({ columnType: "text" })
// value: string
// @Property({ columnType: "jsonb", nullable: true })
// metadata?: Record<string, unknown> | null
// @Property({
//   onCreate: () => new Date(),
//   columnType: "timestamptz",
//   defaultRaw: "now()",
// })
// created_at: Date
// @Property({
//   onCreate: () => new Date(),
//   onUpdate: () => new Date(),
//   columnType: "timestamptz",
//   defaultRaw: "now()",
// })
// updated_at: Date
// @Index({ name: "IDX_product_tag_deleted_at" })
// @Property({ columnType: "timestamptz", nullable: true })
// deleted_at?: Date
// @ManyToMany(() => Product, (product) => product.tags)
// products = new Collection<Product>(this)
// @OnInit()
// @BeforeCreate()
// onInit() {
//   this.id = generateEntityId(this.id, "ptag")
// }
// }

export default ProductTagDML
