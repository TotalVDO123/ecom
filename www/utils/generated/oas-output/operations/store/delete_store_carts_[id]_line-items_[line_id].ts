/**
 * @oas [delete] /store/carts/{id}/line-items/{line_id}
 * operationId: DeleteCartsIdLineItemsLine_id
 * summary: Remove Line Items from Cart
 * description: Remove a list of line items from a cart. This doesn't delete the Line Item, only the association between the Line Item and the cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: line_id
 *     in: path
 *     description: The cart's line id.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/store/carts/{id}/line-items/{line_id}'
 * tags:
 *   - Carts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - id
 *                 - object
 *                 - deleted
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The cart's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the Cart was deleted.
 *             - type: object
 *               description: SUMMARY
 *               properties:
 *                 parent:
 *                   $ref: "#/components/schemas/StoreCart"
 *           description: SUMMARY
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-workflow: deleteLineItemsWorkflow
 * 
*/

