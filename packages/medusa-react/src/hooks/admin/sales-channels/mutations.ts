import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import {
  AdminSalesChannelRes,
  AdminPostSalesChannelsSalesChannelReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminSalesChannelsKeys } from "./queries"

export const useAdminUpdateSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminSalesChannelRes>,
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

/*export const useAdminCreateSalesChannel = (
  options?: UseMutationOptions<
    Response<AdminSalesChannelsRes>,
    Error,
    AdminPostSalesChannelsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  return useMutation(
    (payload: AdminPostSalesChannelsReq) => client.admin.salesChannels.create(payload),
    buildOptions(queryClient, adminSalesChannelsKeys.lists(), options)
  )
}*/

/*export const useAdminDeleteSalesChannel = (
  id: string,
  options?: UseMutationOptions<Response<AdminSalesChannelsDeleteRes>, Error, void>
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
}*/
}
