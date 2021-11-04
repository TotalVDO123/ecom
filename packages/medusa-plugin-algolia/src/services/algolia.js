import { SearchService } from "medusa-interfaces"
import algoliasearch from "algoliasearch"
import { indexTypes } from "medusa-core-utils"
import { transformProduct } from "../utils/transform-product"

class AlgoliaService extends SearchService {
  constructor(container, options) {
    super()

    this.options_ = options
    const { applicationId, adminApiKey } = this.options_

    if (!applicationId) throw new Error("Please provide a valid applicationId");

    if (!adminApiKey) throw new Error("Please provide a valid adminApiKey");

    this.client_ = algoliasearch(applicationId, adminApiKey);
  }

  /**
   *
   * @param {string} indexName - The name of the index
   * @param {*} options - not required just to match the schema we are used it
   * @returns
   */
  createIndex(indexName, options = {}) {
    return this.client_.initIndex(indexName)
  }

  /**
   * Used to get an index
   * @param indexName {string} - the index name.
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  getIndex(indexName) {
    return this.client_
      .initIndex(indexName)
      .browseObjects({
        query: indexName,
        batch: (batch) => {
          hits = hits.concat(batch);
        },
      })
      .then(() => hits);
  }

  /**
   *
   * @param {string} indexName
   * @param {Array} documents - products list array
   * @param {*} type
   * @returns
   */
  addDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_.initIndex(indexName).saveObjects(transformedDocuments)
  }

  /**
   * Used to replace documents
   * @param indexName {string} - the index name.
   * @param documents {Object} - array of document objects that will replace existing documents
   * @param type {Array.<Object>} - type of documents to be replaced (e.g: products, regions, orders, etc)
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  replaceDocuments(indexName, documents, type) {
    const transformedDocuments = this.getTransformedDocuments(type, documents)
    return this.client_
      .initIndex(indexName)
      .replaceAllObjects(transformedDocuments)
  }

  /**
   * Used to delete document
   * @param indexName {string} - the index name
   * @param document_id {string} - the id of the document
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteDocument(indexName, document_id) {
    return this.client_.initIndex(indexName).deleteObject(document_id)
  }

  /**
   * Used to delete all documents
   * @param indexName {string} - the index name
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  deleteAllDocuments(indexName) {
    return this.client_.initIndex(indexName).delete()
  }

  /**
   * Used to search for a document in an index
   * @param indexName {string} - the index name
   * @param query {string} - the search query
   * @param options
   * - any options passed to the request object other than the query and indexName
   * - additionalOptions contain any provider specific options
   * @return {Promise<{ hits: any[]; [k: string]: any; }>} returns response from search engine provider
   */
  search(indexName, query, options) {
    return this.client_.initIndex(indexName).search(query, options)
  }

  /**
   * Used to update the settings of an index
   * @param indexName {string} - the index name
   * @param settings {object} - settings object
   * @return {Promise<{object}>} - returns response from search engine provider
   */
  updateSettings(indexName, settings) {
    return this.client_.initIndex(indexName).setSettings(settings)
  }

  getTransformedDocuments(type, documents) {
    switch (type) {
      case indexTypes.products:
        return this.transformProducts(documents)
      default:
        return documents
    }
  }

  transformProducts(products) {
    if (!products) return []
    return products.map(transformProduct)
  }
}

export default AlgoliaService
