/**
 * The accepted values for the shipping rule option's operator.
 */
export type ShippingOptionRuleOperatorType =
  | "in"
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "nin"

/**
 * The shipping option rule to be created.
 */
export interface CreateShippingOptionRuleDTO {
  /**
   * The attribute of the shipping option rule.
   */
  attribute: string

  /**
   * The operator of the shipping option rule.
   */
  operator: ShippingOptionRuleOperatorType

  /**
   * The value(s) of the shipping option rule.
   */
  value: string | string[]

  /**
   * The associated shipping option's ID.
   */
  shipping_option_id: string
}

/**
 * The attributes to update in the shipping option rule.
 */
export interface UpdateShippingOptionRuleDTO
  extends Partial<CreateShippingOptionRuleDTO> {
  /**
   * The ID of the shipping option rule.
   */
  id: string
}
