import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  deleteCampaignsWorkflow,
  updateCampaignsWorkflow,
} from "@medusajs/core-flows"

import { refetchCampaign } from "../helpers"
import { AdminUpdateCampaignType } from "../validators"
import { MedusaError } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!campaign) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Campaign with id: ${req.params.id} was not found`
    )
  }

  res.status(200).json({ campaign })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateCampaignType>,
  res: MedusaResponse
) => {
  const updateCampaigns = updateCampaignsWorkflow(req.scope)
  const campaignsData = [
    {
      id: req.params.id,
      ...req.validatedBody,
    },
  ]

  await updateCampaigns.run({
    input: { campaignsData },
  })

  const campaign = await refetchCampaign(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ campaign })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const id = req.params.id
  const deleteCampaigns = deleteCampaignsWorkflow(req.scope)

  await deleteCampaigns.run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "campaign",
    deleted: true,
  })
}
