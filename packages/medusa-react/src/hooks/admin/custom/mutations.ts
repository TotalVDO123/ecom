import { Response } from "@medusajs/medusa-js"
import {
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { adminCustomerGroupKeys } from "../customer-groups"
import { adminCustomerKeys } from "../customers"
import { adminDiscountKeys } from "../discounts"
import { adminGiftCardKeys } from "../gift-cards"
import { adminOrderKeys } from "../orders"
import { adminPriceListKeys } from "../price-lists"
import { adminProductKeys } from "../products"

type RelatedDomain =
  | "product"
  | "customer"
  | "customer_group"
  | "order"
  | "discount"
  | "gift_card"
  | "price_list"

export type RelatedDomains = {
  [key in RelatedDomain]?: boolean
}

const invalidateRelatedDomain = (
  queryClient: QueryClient,
  domain: RelatedDomain
) => {
  switch (domain) {
    case "product":
      queryClient.invalidateQueries(adminProductKeys.all)
      break
    case "customer":
      queryClient.invalidateQueries(adminCustomerKeys.all)
      break
    case "customer_group":
      queryClient.invalidateQueries(adminCustomerGroupKeys.all)
      break
    case "order":
      queryClient.invalidateQueries(adminOrderKeys.all)
      break
    case "discount":
      queryClient.invalidateQueries(adminDiscountKeys.all)
      break
    case "gift_card":
      queryClient.invalidateQueries(adminGiftCardKeys.all)
      break
    case "price_list":
      queryClient.invalidateQueries(adminPriceListKeys.all)
      break
  }
}

export const buildCustomOptions = <
  TData,
  TError,
  TVariables,
  TContext,
  TKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey?: TKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  relatedDomains?: RelatedDomains
): UseMutationOptions<TData, TError, TVariables, TContext> => {
  return {
    ...options,
    onSuccess: (...args) => {
      if (options?.onSuccess) {
        return options.onSuccess(...args)
      }

      if (queryKey !== undefined) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key as QueryKey })
        })
      }

      if (relatedDomains) {
        Object.keys(relatedDomains).forEach((key) => {
          if (relatedDomains[key as RelatedDomain]) {
            invalidateRelatedDomain(queryClient, key as RelatedDomain)
          }
        })
      }
    },
  }
}

export const useAdminCreateCustomEntity = <
  TPayload extends Record<string, unknown>,
  TResponse
>(
  path: string,
  queryKey: QueryKey,
  options?: UseMutationOptions<Response<TResponse>, Error, TPayload>,
  relatedDomains?: RelatedDomains
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: TPayload) =>
      client.admin.custom.create<TPayload, TResponse>(path, payload),
    buildCustomOptions(queryClient, queryKey, options, relatedDomains)
  )
}

export const useAdminUpdateCustomEntity = <
  TPayload extends Record<string, unknown>,
  TResponse
>(
  path: string,
  id: string,
  queryKey: QueryKey,
  options?: UseMutationOptions<Response<TResponse>, Error, TPayload>,
  relatedDomains?: RelatedDomains
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: TPayload) =>
      client.admin.custom.update<TPayload, TResponse>(path, id, payload),
    buildCustomOptions(queryClient, queryKey, options, relatedDomains)
  )
}

export const useAdminDeleteCustomEntity = <TResponse>(
  path: string,
  id: string,
  queryKey: QueryKey,
  options?: UseMutationOptions<Response<TResponse>, Error, void>,
  relatedDomains?: RelatedDomains
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.custom.delete<TResponse>(path, id),
    buildCustomOptions(queryClient, queryKey, options, relatedDomains)
  )
}
