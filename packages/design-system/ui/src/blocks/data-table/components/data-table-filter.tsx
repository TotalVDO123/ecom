"use client"

import { EllipseMiniSolid, XMark } from "@medusajs/icons"
import { ColumnFilter } from "@tanstack/react-table"
import * as React from "react"

import { DropdownMenu } from "@/components/dropdown-menu"
import { clx } from "@/utils/clx"

import { DatePicker } from "../../../components/date-picker"
import { Label } from "../../../components/label"
import { useDataTableContext } from "../context/use-data-table-context"
import { DateComparisonOperator, DateFilterProps, FilterOption } from "../types"
import { isDateComparisonOperator } from "../utils/is-date-comparison-operator"

interface DataTableFilterProps {
  filter: ColumnFilter
}

const DEFAULT_FORMAT_DATE_VALUE = (d: Date) =>
  d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
const DEFAULT_RANGE_OPTION_LABEL = "Custom"
const DEFAULT_RANGE_OPTION_START_LABEL = "Starting"
const DEFAULT_RANGE_OPTION_END_LABEL = "Ending"

const DataTableFilter = ({ filter }: DataTableFilterProps) => {
  const { instance } = useDataTableContext()
  const [open, setOpen] = React.useState(filter.value === undefined)
  const [isCustom, setIsCustom] = React.useState(false)

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (
        !open &&
        (!filter.value ||
          (Array.isArray(filter.value) && filter.value.length === 0))
      ) {
        instance.removeFilter(filter.id)
      }

      setOpen(open)
    },
    [instance, filter.id, filter.value]
  )

  const removeFilter = React.useCallback(() => {
    instance.removeFilter(filter.id)
  }, [instance, filter.id])

  const meta = instance.getFilterMeta(filter.id)
  const { id, type, options, label, ...rest } = meta ?? {}

  const value = filter.value

  const displayValue = React.useMemo(() => {
    let displayValue: string | null = null

    if (Array.isArray(value)) {
      displayValue =
        value
          .map((v) => options?.find((o) => o.value === v)?.label)
          .join(", ") ?? null
    }

    if (isDateComparisonOperator(value)) {
      displayValue =
        options?.find((o) => {
          if (!isDateComparisonOperator(o.value)) {
            return false
          }

          return (
            !isCustom &&
            (value.$gte === o.value.$gte || (!value.$gte && !o.value.$gte)) &&
            (value.$lte === o.value.$lte || (!value.$lte && !o.value.$lte)) &&
            (value.$gt === o.value.$gt || (!value.$gt && !o.value.$gt)) &&
            (value.$lt === o.value.$lt || (!value.$lt && !o.value.$lt))
          )
        })?.label ?? null

      if (!displayValue && isDateFilterProps(meta)) {
        const formatDateValue = meta.formatDateValue
          ? meta.formatDateValue
          : DEFAULT_FORMAT_DATE_VALUE

        if (value.$gte && !value.$lte) {
          displayValue = `${
            meta.rangeOptionStartLabel || DEFAULT_RANGE_OPTION_START_LABEL
          } ${formatDateValue(new Date(value.$gte))}`
        }

        if (value.$lte && !value.$gte) {
          displayValue = `${
            meta.rangeOptionEndLabel || DEFAULT_RANGE_OPTION_END_LABEL
          } ${formatDateValue(new Date(value.$lte))}`
        }

        if (value.$gte && value.$lte) {
          displayValue = `${formatDateValue(
            new Date(value.$gte)
          )} - ${formatDateValue(new Date(value.$lte))}`
        }
      }
    }

    return displayValue
  }, [value, options])

  if (!meta) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <div
        className={clx(
          "bg-ui-bg-component flex flex-shrink-0 items-center overflow-hidden rounded-md",
          "[&>*]:txt-compact-small-plus [&>*]:flex [&>*]:items-center [&>*]:justify-center",
          {
            "shadow-borders-base divide-x": displayValue,
            "border border-dashed": !displayValue,
          }
        )}
      >
        {displayValue && (
          <div className="text-ui-fg-muted whitespace-nowrap px-2 py-1">
            {label || id}
          </div>
        )}
        <DropdownMenu.Trigger
          className={clx(
            "text-ui-fg-subtle hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed transition-fg whitespace-nowrap px-2 py-1 outline-none",
            {
              "text-ui-fg-muted": !displayValue,
            }
          )}
        >
          {displayValue || label || id}
        </DropdownMenu.Trigger>

        {displayValue && (
          <button
            type="button"
            className="text-ui-fg-muted hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed transition-fg size-7 outline-none"
            onClick={removeFilter}
          >
            <XMark />
          </button>
        )}
      </div>
      <DropdownMenu.Content align="center">
        {(() => {
          switch (type) {
            case "select":
              return (
                <DataTableFilterSelectContent
                  filter={filter}
                  options={options as FilterOption<string>[]}
                />
              )
            case "radio":
              return (
                <DataTableFilterRadioContent
                  filter={filter}
                  options={options as FilterOption<string>[]}
                />
              )
            case "date":
              return (
                <DataTableFilterDateContent
                  filter={filter}
                  options={options as FilterOption<DateComparisonOperator>[]}
                  setIsCustom={setIsCustom}
                  {...rest}
                />
              )
            default:
              return null
          }
        })()}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

type DataTableFilterDateContentProps = {
  filter: ColumnFilter
  options: FilterOption<DateComparisonOperator>[]
  setIsCustom: (isCustom: boolean) => void
} & Pick<
  DateFilterProps,
  | "format"
  | "rangeOptionLabel"
  | "disableRangeOption"
  | "rangeOptionStartLabel"
  | "rangeOptionEndLabel"
>

function getIsCustomOptionSelected(
  options: FilterOption<DateComparisonOperator>[],
  value: DateComparisonOperator | undefined
) {
  if (!value) {
    return false
  }

  const stringifiedValue = JSON.stringify(value)
  const stringifiedOptions = options.map((option) =>
    JSON.stringify(option.value)
  )

  if (stringifiedOptions.includes(stringifiedValue)) {
    return false
  }

  return !!value.$gte || !!value.$lte
}

const DataTableFilterDateContent = ({
  filter,
  options,
  format = "date",
  rangeOptionLabel = DEFAULT_RANGE_OPTION_LABEL,
  rangeOptionStartLabel = DEFAULT_RANGE_OPTION_START_LABEL,
  rangeOptionEndLabel = DEFAULT_RANGE_OPTION_END_LABEL,
  disableRangeOption = false,
  setIsCustom,
}: DataTableFilterDateContentProps) => {
  const currentValue = filter.value as DateComparisonOperator | undefined
  const { instance } = useDataTableContext()

  const [showCustom, setShowCustom] = React.useState(
    getIsCustomOptionSelected(options, currentValue)
  )

  React.useEffect(() => {
    setIsCustom(showCustom)
  }, [showCustom])

  const selectedValue = React.useMemo(() => {
    if (!currentValue || showCustom) {
      return undefined
    }

    return JSON.stringify(currentValue)
  }, [currentValue, showCustom])

  const onValueChange = React.useCallback(
    (valueStr: string) => {
      const value = JSON.parse(valueStr) as DateComparisonOperator
      instance.updateFilter({ ...filter, value })
    },
    [instance, filter]
  )

  const onSelectCustom = React.useCallback(
    (event: Event) => {
      event.preventDefault()

      setShowCustom(true)
      instance.updateFilter({ ...filter, value: undefined })
    },
    [instance, filter]
  )

  const onCustomValueChange = React.useCallback(
    (input: "$gte" | "$lte", value: Date | null) => {
      const newCurrentValue = { ...currentValue }
      newCurrentValue[input] = value ? value.toISOString() : undefined
      instance.updateFilter({ ...filter, value: newCurrentValue })
    },
    [instance, filter]
  )

  const granularity = format === "date-time" ? "minute" : "day"

  const maxDate = currentValue?.$lte
    ? granularity === "minute"
      ? new Date(currentValue.$lte)
      : new Date(new Date(currentValue.$lte).setHours(23, 59, 59, 999))
    : undefined

  const minDate = currentValue?.$gte
    ? granularity === "minute"
      ? new Date(currentValue.$gte)
      : new Date(new Date(currentValue.$gte).setHours(0, 0, 0, 0))
    : undefined

  return (
    <React.Fragment>
      <DropdownMenu.RadioGroup
        value={selectedValue}
        onValueChange={onValueChange}
      >
        {options.map((option, idx) => {
          return (
            <DropdownMenu.RadioItem
              key={idx}
              value={JSON.stringify(option.value)}
            >
              {option.label}
            </DropdownMenu.RadioItem>
          )
        })}
      </DropdownMenu.RadioGroup>
      {!disableRangeOption && (
        <DropdownMenu.Item
          onSelect={onSelectCustom}
          className="flex items-center gap-2"
        >
          <div className="flex size-[15px] items-center justify-center">
            {showCustom && <EllipseMiniSolid />}
          </div>
          <span>{rangeOptionLabel}</span>
        </DropdownMenu.Item>
      )}
      {!disableRangeOption && showCustom && (
        <React.Fragment>
          <DropdownMenu.Separator />
          <div className="flex flex-col gap-2 px-2 pb-3 pt-1">
            <div className="flex flex-col gap-1">
              <Label id="custom-start-date-label" size="xsmall" weight="plus">
                {rangeOptionStartLabel}
              </Label>
              <DatePicker
                aria-labelledby="custom-start-date-label"
                granularity={granularity}
                value={currentValue?.$gte ? new Date(currentValue.$gte) : null}
                onChange={(value) => onCustomValueChange("$gte", value)}
                maxValue={maxDate}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label id="custom-end-date-label" size="xsmall" weight="plus">
                {rangeOptionEndLabel}
              </Label>
              <DatePicker
                aria-labelledby="custom-end-date-label"
                granularity={granularity}
                value={currentValue?.$lte ? new Date(currentValue.$lte) : null}
                onChange={(value) => onCustomValueChange("$lte", value)}
                minValue={minDate}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

type DataTableFilterSelectContentProps = {
  filter: ColumnFilter
  options: FilterOption<string>[]
}

const DataTableFilterSelectContent = ({
  filter,
  options,
}: DataTableFilterSelectContentProps) => {
  const { instance } = useDataTableContext()

  const currentValue = filter.value as string[] | undefined

  const getChecked = React.useCallback(
    (value: string) => {
      return (checked: boolean) => {
        if (!checked) {
          const newValues = currentValue?.filter((v) => v !== value)
          instance.updateFilter({
            ...filter,
            value: newValues,
          })

          return
        }

        instance.updateFilter({
          ...filter,
          value: [...(currentValue ?? []), value],
        })
      }
    },
    [instance, filter]
  )

  return (
    <React.Fragment>
      {options.map((option) => {
        return (
          <DropdownMenu.CheckboxItem
            onSelect={(e) => e.preventDefault()}
            key={option.value}
            checked={currentValue?.includes(option.value)}
            onCheckedChange={getChecked(option.value)}
          >
            {option.label}
          </DropdownMenu.CheckboxItem>
        )
      })}
    </React.Fragment>
  )
}

type DataTableFilterRadioContentProps = {
  filter: ColumnFilter
  options: FilterOption<string>[]
}

const DataTableFilterRadioContent = ({
  filter,
  options,
}: DataTableFilterRadioContentProps) => {
  const { instance } = useDataTableContext()

  const onValueChange = React.useCallback(
    (value: string) => {
      instance.updateFilter({ ...filter, value })
    },
    [instance, filter]
  )

  return (
    <DropdownMenu.RadioGroup
      value={filter.value as string}
      onValueChange={onValueChange}
    >
      {options.map((option) => {
        return (
          <DropdownMenu.RadioItem key={option.value} value={option.value}>
            {option.label}
          </DropdownMenu.RadioItem>
        )
      })}
    </DropdownMenu.RadioGroup>
  )
}

function isDateFilterProps(props?: unknown | null): props is DateFilterProps {
  if (!props) {
    return false
  }

  return (props as DateFilterProps).type === "date"
}

export { DataTableFilter }
export type { DataTableFilterProps }
