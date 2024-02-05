import { DAL } from "@medusajs/types"
import { DALUtils, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Country from "./country"
import Currency from "./currency"

type RegionOptionalProps =
  | "currency"
  | "countries"
  | DAL.SoftDeletableEntityDateColumns

@Entity({ tableName: "region" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Region {
  [OptionalProps]?: RegionOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  name: string

  @ManyToOne({
    entity: () => Currency,
    onDelete: "cascade",
    fieldName: "currency_code",
    index: "IDX_region_currency_code",
  })
  currency: Currency

  @OneToMany(() => Country, (country) => country.region)
  countries = new Collection<Country>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_region_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "reg")
  }

  @BeforeCreate()
  onInit() {
    this.id = generateEntityId(this.id, "reg")
  }
}
