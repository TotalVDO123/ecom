/**
 * @schema AdminPromotionRule
 * type: object
 * description: The target rule's target rules.
 * x-schemaName: AdminPromotionRule
 * required:
 *   - id
 *   - values
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The target rule's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The target rule's description.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The target rule's attribute.
 *   operator:
 *     type: string
 *     description: The target rule's operator.
 *     enum:
 *       - gt
 *       - lt
 *       - eq
 *       - ne
 *       - in
 *       - lte
 *       - gte
 *   values:
 *     type: array
 *     description: The target rule's values.
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRuleValue"
 * 
*/

