import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Check,
  Entity,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "cart_line_item_adjustment_line" })
@Check<LineItemAdjustmentLine>({
  expression: (columns) => `${columns.amount} >= 0`,
})
export default class LineItemAdjustmentLine extends AdjustmentLine {
  @ManyToOne(() => LineItem, {
    onDelete: "cascade",
    nullable: true,
    index: "IDX_adjustment_line_item_id",
  })
  item?: LineItem | null

  @Property({ columnType: "text" })
  item_id: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "caliadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "caliadj")
  }
}
