/**
 * @schema AdminPostClaimsShippingReqSchema
 * type: object
 * description: The details of the shipping method used to ship outbound items.
 * x-schemaName: AdminPostClaimsShippingReqSchema
 * required:
 *   - shipping_option_id
 * properties:
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the associated shipping option.
 *   custom_amount:
 *     type: number
 *     title: custom_amount
 *     description: Set a custom price for the shipping method.
 *   description:
 *     type: string
 *     title: description
 *     description: The shipping method's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note only viewed by admin users.
 *   metadata:
 *     type: object
 *     description: The claim's metadata, can hold custom key-value pairs.
 * 
*/

