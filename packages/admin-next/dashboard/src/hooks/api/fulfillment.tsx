import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { queryKeysFactory } from "../../lib/query-key-factory"

import { HttpTypes } from "@medusajs/types"
import { client, sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"

const FULFILLMENTS_QUERY_KEY = "fulfillments" as const
export const fulfillmentsQueryKeys = queryKeysFactory(FULFILLMENTS_QUERY_KEY)

export const useCreateFulfillment = (
  options?: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: (payload: any) => sdk.admin.fulfillment.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: fulfillmentsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelFulfillment = (
  id: string,
  options?: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.fulfillment.cancel(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: fulfillmentsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateFulfillmentShipment = (
  fulfillmentId: string,
  options?: UseMutationOptions<
    { fulfillment: HttpTypes.AdminFulfillment },
    Error,
    HttpTypes.AdminCreateFulfillmentShipment
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateFulfillmentShipment) =>
      sdk.admin.fulfillment.createShipment(fulfillmentId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
