import { Text, Tooltip, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type ListSummaryProps = {
  /**
   * Number of initial items to display
   * @default 2
   */
  n?: number
  /**
   * List of strings to display as abbreviated list
   */
  list: string[]
  /**
   * Is the summary displayed inline.
   * Determines whether the center text is truncated if there is no space in the container
   */
  inline?: boolean

  className?: string
}

export const ListSummary = ({
  list,
  className,
  inline,
  n = 2,
}: ListSummaryProps) => {
  const { t } = useTranslation()

  const title = t("general.plusCountMore", {
    count: list.length - n,
  })

  return (
    <div
      className={
        (clx("text-ui-fg-subtle txt-compact-small", {
          "inline-flex": inline,
          flex: !inline,
        }),
        className)
      }
    >
      <span className="truncate">{list.slice(0, n).join(", ")}</span>
      {list.length > n && (
        <Tooltip
          content={
            <ul>
              {list.slice(n).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          }
        >
          <Text
            as="span"
            size="small"
            weight="plus"
            leading="compact"
            className="cursor-default whitespace-nowrap"
            title={title}
          >
            {" "}
            {title}
          </Text>
        </Tooltip>
      )}
    </div>
  )
}
