import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  Index,
  RelationId,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Swap } from "./swap"
import { Cart } from "./cart"
import { Order } from "./order"
import { ProductVariant } from "./product-variant"

@Check(`"fulfilled_quantity" <= "quantity"`)
@Check(`"shipped_quantity" <= "fulfilled_quantity"`)
@Check(`"returned_quantity" <= "quantity"`)
@Check(`"quantity" > 0`)
@Entity()
export class LineItem {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ nullable: true })
  @RelationId((li: LineItem) => li.cart)
  cart_id: string

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  cart: Cart

  @Index()
  @Column({ nullable: true })
  @RelationId((li: LineItem) => li.order)
  order_id: string

  @ManyToOne(
    () => Order,
    order => order.items
  )
  order: Order

  @Index()
  @Column({ nullable: true })
  @RelationId((li: LineItem) => li.order)
  swap_id: string

  @ManyToOne(
    () => Swap,
    swap => swap.additional_items
  )
  swap: Swap

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  thumbnail: string

  @Column({ default: false })
  is_giftcard: boolean

  @Column({ default: true })
  should_merge: boolean

  @Column({ default: true })
  allow_discounts: boolean

  @Column({ type: "int" })
  unit_price: number

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "int" })
  quantity: number

  @Column({ nullable: true, type: "int" })
  fulfilled_quantity: number

  @Column({ nullable: true, type: "int" })
  returned_quantity: number

  @Column({ nullable: true, type: "int" })
  shipped_quantity: number

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `item_${id}`
  }
}
