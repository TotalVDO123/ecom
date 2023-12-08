import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the `div` element and supports all props of this element.
 */
const Container = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clx(
        "shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg px-8 pb-8 pt-6",
        className
      )}
      {...props}
    />
  )
})
Container.displayName = "Container"

export { Container }
