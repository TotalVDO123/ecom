import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { useV2Promotion } from "../../../lib/api-v2/promotion"
import { EditPromotionDetailsForm } from "./components/edit-promotion-form"

export const PromotionEditDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { promotion, isLoading, isError, error } = useV2Promotion(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("promotions.edit.title")}</Heading>
      </RouteDrawer.Header>

      {!isLoading && promotion && (
        <EditPromotionDetailsForm promotion={promotion} />
      )}
    </RouteDrawer>
  )
}
