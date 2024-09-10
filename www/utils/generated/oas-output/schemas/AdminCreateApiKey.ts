/**
 * @schema AdminCreateApiKey
 * type: object
 * description: The API key's details.
 * x-schemaName: AdminCreateApiKey
 * required:
 *   - title
 *   - type
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The API key's title.
 *   type:
 *     type: string
 *     description: The API key's type. Use `secret` for a user's API key; Use `publishable` for Publishable API keys.
 *     enum:
 *       - publishable
 *       - secret
 * 
*/

