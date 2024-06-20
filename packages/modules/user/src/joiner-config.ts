import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"

export const joinerConfig = defineJoinerConfig(Modules.USER)

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
