import {
  AdminCollectionsDeleteRes,
  AdminCollectionsListRes,
  AdminCollectionsRes,
  AdminDeleteProductsFromCollectionReq,
  AdminDeleteProductsFromCollectionRes,
  AdminGetCollectionsParams,
  AdminPostCollectionsCollectionReq,
  AdminPostCollectionsReq,
  AdminPostProductsToCollectionReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product Collection API Routes](https://docs.medusajs.com/api/admin#product-collections).
 * 
 * All methods in this class require {@link auth.createSession | user authentication}.
 */
class AdminCollectionsResource extends BaseResource {
  /**
   * Create a product collection.
   * @param {AdminPostCollectionsReq} payload - The data of the product collection to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsRes>} The product collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.create({
   *   title: "New Collection"
   * })
   * .then(({ collection }) => {
   *   console.log(collection.id);
   * });
   */
  create(
    payload: AdminPostCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a product collection's details.
   * @param {string} id - The ID of the product collection.
   * @param {AdminPostCollectionsCollectionReq} payload - The data to update in the product collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsRes>} the product collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.update(collectionId, {
   *   title: "New Collection"
   * })
   * .then(({ collection }) => {
   *   console.log(collection.id);
   * });
   */
  update(
    id: string,
    payload: AdminPostCollectionsCollectionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a product collection. This does not delete associated products.
   * @param {string} id - The ID of the product collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsDeleteRes>} The deletion operation details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.delete(collectionId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * });
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsDeleteRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a product collection by its ID. The products associated with it are expanded and returned as well.
   * @param {string} id - The ID of the product collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsRes>} The product collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.retrieve(collectionId)
   * .then(({ collection }) => {
   *   console.log(collection.id);
   * });
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of product collections. The product collections can be filtered by fields such as `handle` or `title`. The collections can also be sorted or paginated.
   * @param {AdminGetCollectionsParams} query - Filters and pagination configurations to apply on the retrieved product collections.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsListRes>} The list of product collections with pagination fields.
   * 
   * @example
   * To list product collections:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.list()
   * .then(({ collections, limit, offset, count }) => {
   *   console.log(collections.length);
   * });
   * ```
   * 
   * By default, only the first `10` records are retrieved. You can control pagination by specifying the skip and take parameters:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.list({
   *   limit,
   *   offset
   * })
   * .then(({ collections, limit, offset, count }) => {
   *   console.log(collections.length);
   * });
   * ```
   */
  list(
    query?: AdminGetCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsListRes> {
    let path = `/admin/collections`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/collections?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add products to collection.
   * @param {string} id - The ID of the product collection.
   * @param {AdminPostProductsToCollectionReq} payload - The details of the products to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminCollectionsRes>} The product collection's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.addProducts(collectionId, {
   *   product_ids: [
   *     productId1,
   *     productId2
   *   ]
   * })
   * .then(({ collection }) => {
   *   console.log(collection.products)
   * })
   */
  addProducts(
    id: string,
    payload: AdminPostProductsToCollectionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminCollectionsRes> {
    const path = `/admin/collections/${id}/products/batch`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Remove a list of products from a collection. This would not delete the product, only the association between the product and the collection.
   * @param {string} id - the ID of the product collection
   * @param {AdminDeleteProductsFromCollectionReq} payload - The details of the products to remove from the collection.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminDeleteProductsFromCollectionRes>} The deletion operation details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.collections.removeProducts(collectionId, {
   *   product_ids: [
   *     productId1,
   *     productId2
   *   ]
   * })
   * .then(({ id, object, removed_products }) => {
   *   console.log(removed_products)
   * })
   */
  removeProducts(
    id: string,
    payload: AdminDeleteProductsFromCollectionReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminDeleteProductsFromCollectionRes> {
    const path = `/admin/collections/${id}/products/batch`
    return this.client.request("DELETE", path, payload, {}, customHeaders)
  }
}

export default AdminCollectionsResource
