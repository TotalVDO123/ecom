/**
 * @oas [get] /admin/sales-channels
 * operationId: GetSalesChannels
 * summary: List Sales Channels
 * description: Retrieve a list of sales channels. The sales channels can be filtered by fields such as `id`. The sales channels can also be sorted or paginated.
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
 *   - name: q
 *     in: query
 *     description: The sales channel's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The sales channel's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The sales channel's ID.
 *         - type: array
 *           description: The sales channel's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: name
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: name
 *           description: The sales channel's name.
 *         - type: array
 *           description: The sales channel's name.
 *           items:
 *             type: string
 *             title: name
 *             description: The name's details.
 *   - name: description
 *     in: query
 *     description: The sales channel's description.
 *     required: false
 *     schema:
 *       type: string
 *       title: description
 *       description: The sales channel's description.
 *   - name: is_disabled
 *     in: query
 *     description: The sales channel's is disabled.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: is_disabled
 *       description: The sales channel's is disabled.
 *   - name: created_at
 *     in: query
 *     description: The sales channel's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The sales channel's created at.
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
 *     description: The sales channel's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The sales channel's updated at.
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
 *     description: The sales channel's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The sales channel's deleted at.
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
 *   - name: location_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: location_id
 *           description: The sales channel's location id.
 *         - type: array
 *           description: The sales channel's location id.
 *           items:
 *             type: string
 *             title: location_id
 *             description: The location id's details.
 *   - name: publishable_key_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: publishable_key_id
 *           description: The sales channel's publishable key id.
 *         - type: array
 *           description: The sales channel's publishable key id.
 *           items:
 *             type: string
 *             title: publishable_key_id
 *             description: The publishable key id's details.
 *   - name: $and
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The sales channel's $and.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The sales channel's $or.
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
 *       curl '{backend_url}/admin/sales-channels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Sales Channels
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
 *                   description: The sales channel's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The sales channel's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The sales channel's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - sales_channels
 *               properties:
 *                 sales_channels:
 *                   type: array
 *                   description: The sales channel's sales channels.
 *                   items:
 *                     $ref: "#/components/schemas/AdminSalesChannel"
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

