import {
  AdminPostSalesChannelsReq,
  AdminSalesChannelsRes,
  AdminPostSalesChannelsSalesChannelReq,
  AdminSalesChannelsDeleteRes,
  AdminDeleteSalesChannelsSalesChannelProductsBatchReq
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMutation, UseMutationOptions, useQueryClient } from "react-query"

import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminSalesChannelsKeys } from "./queries"

/**
 * Hook provides a mutation function for creating sales channel.
 *
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable the corresponding feature flag in your medusa backend project.
 */
export const useAdminCreateSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostSalesChannelsReq) =>
      client.admin.salesChannels.create(payload),
    buildOptions(queryClient, [adminSalesChannelsKeys.list()], options)
  )
}

/** update a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description updates a sales channel
 * @returns the updated medusa sales channel
 */
export const useAdminUpdateSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsSalesChannelReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostSalesChannelsSalesChannelReq) =>
      client.admin.salesChannels.update(id, payload),
    buildOptions(
      queryClient,
      [adminSalesChannelsKeys.lists(), adminSalesChannelsKeys.detail(id)],
      options
    )
  )
}

/**
 * Delete a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
 * @param id
 * @param options
 */
export const useAdminDeleteSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    () => client.admin.salesChannels.delete(id),
    buildOptions(
      queryClient,
      [adminSalesChannelsKeys.lists(), adminSalesChannelsKeys.detail(id)],
      options
    )
  )
}

/**
 * Remove products from a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable featureflag `sales_channels` in your medusa backend project.
 * @description remove products from a sales channel
 * @param id
 * @param options
 */
export const useAdminDeleteProductsFromSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminDeleteSalesChannelsSalesChannelProductsBatchReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminDeleteSalesChannelsSalesChannelProductsBatchReq) => {
      return client.admin.salesChannels.removeProducts(id, payload)
    },
    buildOptions(
      queryClient,
      [adminSalesChannelsKeys.lists(), adminSalesChannelsKeys.detail(id)],
      options
    )
  )
}