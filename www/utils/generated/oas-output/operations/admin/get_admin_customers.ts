/**
 * @oas [get] /admin/customers
 * operationId: GetCustomers
 * summary: List Customers
 * description: Retrieve a list of customers. The customers can be filtered by fields such as `id`. The customers can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
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
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: groups
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: groups
 *           description: The customer's groups.
 *         - type: array
 *           description: The customer's groups.
 *           items:
 *             type: string
 *             title: groups
 *             description: The group's groups.
 *         - $ref: "#/components/schemas/CustomerGroupInCustomerFilters"
 *   - name: has_account
 *     in: query
 *     description: The customer's has account.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: has_account
 *       description: The customer's has account.
 *   - name: q
 *     in: query
 *     description: The customer's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The customer's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The customer's ID.
 *         - type: array
 *           description: The customer's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *         - type: object
 *           description: The customer's ID.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     oneOf:
 *                       - type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                       - type: array
 *                         description: Filter by an exact match.
 *                         items:
 *                           type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *             $ne:
 *               oneOf:
 *                 - type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 - type: array
 *                   description: Filter by values not equal to this parameter.
 *                   items:
 *                     type: string
 *                     title: $ne
 *                     description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 oneOf:
 *                   - type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                   - type: array
 *                     description: Filter by values in this array.
 *                     items:
 *                       type: string
 *                       title: $in
 *                       description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 oneOf:
 *                   - type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                   - type: array
 *                     description: Filter by values not in this array.
 *                     items:
 *                       type: string
 *                       title: $nin
 *                       description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     oneOf:
 *                       - type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                       - type: object
 *                         description: Filter by values not matching the conditions in this parameter.
 *                         properties:
 *                           $and:
 *                             type: array
 *                             description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                             items:
 *                               type: object
 *                             title: $and
 *                           $or:
 *                             type: array
 *                             description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                             items:
 *                               type: object
 *                             title: $or
 *                           $eq:
 *                             oneOf:
 *                               - type: string
 *                                 title: $eq
 *                                 description: Filter by an exact match.
 *                               - type: array
 *                                 description: Filter by an exact match.
 *                                 items:
 *                                   type: string
 *                                   title: $eq
 *                                   description: Filter by an exact match.
 *                           $ne:
 *                             type: string
 *                             title: $ne
 *                             description: Filter by values not equal to this parameter.
 *                           $in:
 *                             type: array
 *                             description: Filter by values in this array.
 *                             items:
 *                               type: string
 *                               title: $in
 *                               description: Filter by values in this array.
 *                           $nin:
 *                             type: array
 *                             description: Filter by values not in this array.
 *                             items:
 *                               type: string
 *                               title: $nin
 *                               description: Filter by values not in this array.
 *                           $not:
 *                             oneOf:
 *                               - type: string
 *                                 title: $not
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                               - type: object
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                               - type: array
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                                 items:
 *                                   type: string
 *                                   title: $not
 *                                   description: Filter by values not matching the conditions in this parameter.
 *                           $gt:
 *                             type: string
 *                             title: $gt
 *                             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                           $gte:
 *                             type: string
 *                             title: $gte
 *                             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                           $lt:
 *                             type: string
 *                             title: $lt
 *                             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                           $lte:
 *                             type: string
 *                             title: $lte
 *                             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                           $like:
 *                             type: string
 *                             title: $like
 *                             description: Apply a `like` filter. Useful for strings only.
 *                           $re:
 *                             type: string
 *                             title: $re
 *                             description: Apply a regex filter. Useful for strings only.
 *                           $ilike:
 *                             type: string
 *                             title: $ilike
 *                             description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                           $fulltext:
 *                             type: string
 *                             title: $fulltext
 *                             description: Filter to apply on full-text properties.
 *                           $overlap:
 *                             type: array
 *                             description: Filter arrays that have overlapping values with this parameter.
 *                             items:
 *                               type: string
 *                               title: $overlap
 *                               description: Filter arrays that have overlapping values with this parameter.
 *                           $contains:
 *                             type: array
 *                             description: Filter arrays that contain some of the values of this parameter.
 *                             items:
 *                               type: string
 *                               title: $contains
 *                               description: Filter arrays that contain some of the values of this parameter.
 *                           $contained:
 *                             type: array
 *                             description: Filter arrays that contain all values of this parameter.
 *                             items:
 *                               type: string
 *                               title: $contained
 *                               description: Filter arrays that contain all values of this parameter.
 *                           $exists:
 *                             type: boolean
 *                             title: $exists
 *                             description: Filter by whether a value for this parameter exists (not `null`).
 *             $gt:
 *               oneOf:
 *                 - type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 - type: array
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                   items:
 *                     type: string
 *                     title: $gt
 *                     description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               oneOf:
 *                 - type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 - type: array
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                   items:
 *                     type: string
 *                     title: $gte
 *                     description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               oneOf:
 *                 - type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 - type: array
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                   items:
 *                     type: string
 *                     title: $lt
 *                     description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               oneOf:
 *                 - type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 - type: array
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                   items:
 *                     type: string
 *                     title: $lte
 *                     description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: email
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: email
 *           description: The customer's email.
 *           format: email
 *         - type: array
 *           description: The customer's email.
 *           items:
 *             type: string
 *             title: email
 *             description: The email's details.
 *             format: email
 *         - type: object
 *           description: The customer's email.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *             $ne:
 *               type: string
 *               title: $ne
 *               description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 type: string
 *                 title: $in
 *                 description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 type: string
 *                 title: $nin
 *                 description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *             $gt:
 *               type: string
 *               title: $gt
 *               description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               type: string
 *               title: $gte
 *               description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               type: string
 *               title: $lt
 *               description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               type: string
 *               title: $lte
 *               description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: company_name
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: company_name
 *           description: The customer's company name.
 *         - type: array
 *           description: The customer's company name.
 *           items:
 *             type: string
 *             title: company_name
 *             description: The company name's details.
 *         - type: object
 *           description: The customer's company name.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *             $ne:
 *               type: string
 *               title: $ne
 *               description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 type: string
 *                 title: $in
 *                 description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 type: string
 *                 title: $nin
 *                 description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *             $gt:
 *               type: string
 *               title: $gt
 *               description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               type: string
 *               title: $gte
 *               description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               type: string
 *               title: $lt
 *               description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               type: string
 *               title: $lte
 *               description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: first_name
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: first_name
 *           description: The customer's first name.
 *         - type: array
 *           description: The customer's first name.
 *           items:
 *             type: string
 *             title: first_name
 *             description: The first name's details.
 *         - type: object
 *           description: The customer's first name.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *             $ne:
 *               type: string
 *               title: $ne
 *               description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 type: string
 *                 title: $in
 *                 description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 type: string
 *                 title: $nin
 *                 description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *             $gt:
 *               type: string
 *               title: $gt
 *               description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               type: string
 *               title: $gte
 *               description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               type: string
 *               title: $lt
 *               description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               type: string
 *               title: $lte
 *               description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: last_name
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: last_name
 *           description: The customer's last name.
 *         - type: array
 *           description: The customer's last name.
 *           items:
 *             type: string
 *             title: last_name
 *             description: The last name's details.
 *         - type: object
 *           description: The customer's last name.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *             $ne:
 *               type: string
 *               title: $ne
 *               description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 type: string
 *                 title: $in
 *                 description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 type: string
 *                 title: $nin
 *                 description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *             $gt:
 *               type: string
 *               title: $gt
 *               description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               type: string
 *               title: $gte
 *               description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               type: string
 *               title: $lt
 *               description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               type: string
 *               title: $lte
 *               description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: created_by
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: created_by
 *           description: The customer's created by.
 *         - type: array
 *           description: The customer's created by.
 *           items:
 *             type: string
 *             title: created_by
 *             description: The created by's details.
 *         - type: object
 *           description: The customer's created by.
 *           properties:
 *             $and:
 *               type: array
 *               description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $and
 *             $or:
 *               type: array
 *               description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *               items:
 *                 type: object
 *               title: $or
 *             $eq:
 *               oneOf:
 *                 - type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *                 - type: array
 *                   description: Filter by an exact match.
 *                   items:
 *                     type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *             $ne:
 *               type: string
 *               title: $ne
 *               description: Filter by values not equal to this parameter.
 *             $in:
 *               type: array
 *               description: Filter by values in this array.
 *               items:
 *                 type: string
 *                 title: $in
 *                 description: Filter by values in this array.
 *             $nin:
 *               type: array
 *               description: Filter by values not in this array.
 *               items:
 *                 type: string
 *                 title: $nin
 *                 description: Filter by values not in this array.
 *             $not:
 *               oneOf:
 *                 - type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *                 - type: object
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   properties:
 *                     $and:
 *                       type: array
 *                       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $and
 *                     $or:
 *                       type: array
 *                       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                       items:
 *                         type: object
 *                       title: $or
 *                     $eq:
 *                       oneOf:
 *                         - type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                         - type: array
 *                           description: Filter by an exact match.
 *                           items:
 *                             type: string
 *                             title: $eq
 *                             description: Filter by an exact match.
 *                     $ne:
 *                       type: string
 *                       title: $ne
 *                       description: Filter by values not equal to this parameter.
 *                     $in:
 *                       type: array
 *                       description: Filter by values in this array.
 *                       items:
 *                         type: string
 *                         title: $in
 *                         description: Filter by values in this array.
 *                     $nin:
 *                       type: array
 *                       description: Filter by values not in this array.
 *                       items:
 *                         type: string
 *                         title: $nin
 *                         description: Filter by values not in this array.
 *                     $not:
 *                       oneOf:
 *                         - type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: object
 *                           description: Filter by values not matching the conditions in this parameter.
 *                         - type: array
 *                           description: Filter by values not matching the conditions in this parameter.
 *                           items:
 *                             type: string
 *                             title: $not
 *                             description: Filter by values not matching the conditions in this parameter.
 *                     $gt:
 *                       type: string
 *                       title: $gt
 *                       description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                     $gte:
 *                       type: string
 *                       title: $gte
 *                       description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                     $lt:
 *                       type: string
 *                       title: $lt
 *                       description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                     $lte:
 *                       type: string
 *                       title: $lte
 *                       description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                     $like:
 *                       type: string
 *                       title: $like
 *                       description: Apply a `like` filter. Useful for strings only.
 *                     $re:
 *                       type: string
 *                       title: $re
 *                       description: Apply a regex filter. Useful for strings only.
 *                     $ilike:
 *                       type: string
 *                       title: $ilike
 *                       description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                     $fulltext:
 *                       type: string
 *                       title: $fulltext
 *                       description: Filter to apply on full-text properties.
 *                     $overlap:
 *                       type: array
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                       items:
 *                         type: string
 *                         title: $overlap
 *                         description: Filter arrays that have overlapping values with this parameter.
 *                     $contains:
 *                       type: array
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contains
 *                         description: Filter arrays that contain some of the values of this parameter.
 *                     $contained:
 *                       type: array
 *                       description: Filter arrays that contain all values of this parameter.
 *                       items:
 *                         type: string
 *                         title: $contained
 *                         description: Filter arrays that contain all values of this parameter.
 *                     $exists:
 *                       type: boolean
 *                       title: $exists
 *                       description: Filter by whether a value for this parameter exists (not `null`).
 *                 - type: array
 *                   description: Filter by values not matching the conditions in this parameter.
 *                   items:
 *                     type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *             $gt:
 *               type: string
 *               title: $gt
 *               description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *             $gte:
 *               type: string
 *               title: $gte
 *               description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *             $lt:
 *               type: string
 *               title: $lt
 *               description: Filter by values less than this parameter. Useful for numbers and dates only.
 *             $lte:
 *               type: string
 *               title: $lte
 *               description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *             $like:
 *               type: string
 *               title: $like
 *               description: Apply a `like` filter. Useful for strings only.
 *             $re:
 *               type: string
 *               title: $re
 *               description: Apply a regex filter. Useful for strings only.
 *             $ilike:
 *               type: string
 *               title: $ilike
 *               description: Apply a case-insensitive `like` filter. Useful for strings only.
 *             $fulltext:
 *               type: string
 *               title: $fulltext
 *               description: Filter to apply on full-text properties.
 *             $overlap:
 *               type: array
 *               description: Filter arrays that have overlapping values with this parameter.
 *               items:
 *                 type: string
 *                 title: $overlap
 *                 description: Filter arrays that have overlapping values with this parameter.
 *             $contains:
 *               type: array
 *               description: Filter arrays that contain some of the values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contains
 *                 description: Filter arrays that contain some of the values of this parameter.
 *             $contained:
 *               type: array
 *               description: Filter arrays that contain all values of this parameter.
 *               items:
 *                 type: string
 *                 title: $contained
 *                 description: Filter arrays that contain all values of this parameter.
 *             $exists:
 *               type: boolean
 *               title: $exists
 *               description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: created_at
 *     in: query
 *     description: The customer's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The customer's created at.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: updated_at
 *     in: query
 *     description: The customer's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The customer's updated at.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: deleted_at
 *     in: query
 *     description: The customer's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The customer's deleted at.
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $and
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *           title: $or
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by values not equal to this parameter.
 *         $in:
 *           type: array
 *           description: Filter by values in this array.
 *           items:
 *             type: string
 *             title: $in
 *             description: Filter by values in this array.
 *         $nin:
 *           type: array
 *           description: Filter by values not in this array.
 *           items:
 *             type: string
 *             title: $nin
 *             description: Filter by values not in this array.
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           description: Filter arrays that have overlapping values with this parameter.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: Filter arrays that have overlapping values with this parameter.
 *         $contains:
 *           type: array
 *           description: Filter arrays that contain some of the values of this parameter.
 *           items:
 *             type: string
 *             title: $contains
 *             description: Filter arrays that contain some of the values of this parameter.
 *         $contained:
 *           type: array
 *           description: Filter arrays that contain all values of this parameter.
 *           items:
 *             type: string
 *             title: $contained
 *             description: Filter arrays that contain all values of this parameter.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value for this parameter exists (not `null`).
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/customers' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Customers
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
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The customer's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The customer's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The customer's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - customers
 *               properties:
 *                 customers:
 *                   $ref: "#/components/schemas/AdminCustomer"
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
 * 
*/

