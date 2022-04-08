import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm"
import { BaseEntity } from "./_base"

import { Address } from "./address"
import { CustomerGroup } from "./customer-group"
import { Order } from "./order"

@Entity()
export class Customer extends BaseEntity {
  @Index({ unique: true })
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Index()
  @Column({ nullable: true })
  billing_address_id: string

  @OneToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billing_address: Address

  @OneToMany(() => Address, (address) => address.customer)
  shipping_addresses: Address[]

  @Column({ nullable: true, select: false })
  password_hash: string

  @Column({ nullable: true })
  phone: string

  @Column({ default: false })
  has_account: boolean

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[]

  @JoinTable({
    name: "customer_group_customers",
    inverseJoinColumn: {
      name: "customer_group_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "customer_id",
      referencedColumnName: "id",
    },
  })
  @ManyToMany(() => CustomerGroup, (cg) => cg.customers, {
    onDelete: "CASCADE",
  })
  groups: CustomerGroup[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.generateId('cus')
  }
}

/**
 * @schema customer
 * title: "Customer"
 * description: "Represents a customer"
 * x-resourceId: customer
 * properties:
 *   id:
 *     type: string
 *   email:
 *     type: string
 *   billing_address_id:
 *     type: string
 *   billing_address:
 *     description: "The Customer's billing address."
 *     anyOf:
 *       - $ref: "#/components/schemas/address"
 *   shipping_addresses:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/address"
 *   first_name:
 *     type: string
 *   last_name:
 *     type: string
 *   phone:
 *     type: string
 *   has_account:
 *     type: boolean
 *   created_at:
 *     type: string
 *     format: date-time
 *   updated_at:
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *   metadata:
 *     type: object
 */
