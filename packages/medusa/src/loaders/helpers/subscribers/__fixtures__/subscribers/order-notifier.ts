import {
  SubscriberArgs,
  SubscriberConfig,
} from "../../../../../types/subscribers"

export default async function orderNotifier({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs) {
  return Promise.resolve()
}

export const config: SubscriberConfig = {
  event: ["order.placed", "order.cancelled", "order.completed"],
  context: { subscriberId: "order-notifier" },
}
