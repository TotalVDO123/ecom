import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * An API key's type.
 */
export type ApiKeyType = "secret" | "publishable"

/**
 * The API key details.
 */
export interface ApiKeyDTO {
  /**
   * The ID of the API key.
   */
  id: string

  /**
   * The token of the API key.
   */
  token: string

  /**
   * The redacted form of the API key's token. This is useful
   * when showing portion of the token. For example `sk_...123`.
   */
  redacted: string

  /**
   * The title of the API key.
   */
  title: string

  /**
   * The type of the API key.
   */
  type: ApiKeyType

  /**
   * The date the API key was last used.
   */
  last_used_at: Date | null

  /**
   * Who created the API key.
   */
  created_by: string

  /**
   * The date the API key was created.
   */
  created_at: Date

  /**
   * Who revoked the API key.
   */
  revoked_by: string | null

  /**
   * The date the API key was revoked.
   */
  revoked_at: Date | null
}

/**
 * The filters to apply on the retrieved API keys.
 */
export interface FilterableApiKeyProps
  extends BaseFilterable<FilterableApiKeyProps> {
  /**
   * The IDs to filter the API keys by.
   */
  id?: string | string[]

  /**
   * The tokens to filter the API keys by.
   */
  token?: string | string[]

  /**
   * The titles to filter the API keys by.
   */
  title?: string | string[]

  /**
   * Filter the API keys by their type.
   */
  type?: ApiKeyType
}
