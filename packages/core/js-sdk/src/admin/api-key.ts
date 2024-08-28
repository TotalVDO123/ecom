import { FindParams, HttpTypes, PaginatedResponse } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class ApiKey {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(queryParams?: FindParams, headers?: ClientHeaders) {
    return await this.client.fetch<
      PaginatedResponse<HttpTypes.AdminApiKeyListResponse>
    >(`/admin/api-keys`, {
      query: queryParams,
      headers,
    })
  }

  async create(body: HttpTypes.AdminCreateApiKey, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async revoke(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async retrieve(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        headers,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateApiKey,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"api_key">>(
      `/admin/api-keys/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async removeSalesChannels(
    id: string,
    body: { sales_channel_ids: string[] },
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}/sales-channels`,
      {
        method: "DELETE",
        headers,
        body,
      }
    )
  }

  async addSalesChannels(
    id: string,
    body: { sales_channel_ids: string[] },
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminApiKeyResponse>(
      `/admin/api-keys/${id}/sales-channels`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
