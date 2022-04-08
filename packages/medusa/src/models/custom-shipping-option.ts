import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm"
import { BaseEntity } from "./_base"
import { Cart } from "./cart"
import { ShippingOption } from "./shipping-option"

@Entity()
@Unique(["shipping_option_id", "cart_id"])
export class CustomShippingOption extends BaseEntity {
  @Column({ type: "int" })
  price: number

  @Index()
  @Column()
  shipping_option_id: string

  @ManyToOne(() => ShippingOption)
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @BeforeInsert()
  private beforeInsert(): void {
    this.generateId('cso')
  }
}

/**
 * @schema custom_shipping_option
 * title: "Custom Shipping Option"
 * description: "Custom Shipping Options are 'overriden' Shipping Options. Store managers can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option"
 * x-resourceId: custom_shipping_option
 * properties:
 *   id:
 *     description: "The id of the Custom Shipping Option. This value will be prefixed with `cso_`."
 *     type: string
 *   price:
 *     description: "The custom price set that will override the shipping option's original price"
 *     type: integer
 *   shipping_option_id:
 *     description: "The id of the Shipping Option that the custom shipping option overrides"
 *     anyOf:
 *       - $ref: "#/components/schemas/shipping_option"
 *   cart_id:
 *     description: "The id of the Cart that the custom shipping option is attached to"
 *     anyOf:
 *       - $ref: "#/components/schemas/cart"
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */
