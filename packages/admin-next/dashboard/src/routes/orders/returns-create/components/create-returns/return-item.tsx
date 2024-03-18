import React from "react"
import { useTranslation } from "react-i18next"

import { Trash } from "@medusajs/icons"
import { Input, Select, Text } from "@medusajs/ui"
import { LineItem } from "@medusajs/medusa"
import { UseFormReturn } from "react-hook-form"
import { useAdminReturnReasons } from "medusa-react"

import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Form } from "../../../../../components/common/form"

type OrderEditItemProps = {
  item: LineItem
  currencyCode: string

  form: UseFormReturn<any>
  onQuantityChangeComplete: (id: string) => void
}

function ReturnItem({
  item,
  currencyCode,
  form,
  onQuantityChangeComplete,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const { return_reasons = [] } = useAdminReturnReasons()

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl ">
      <div className="flex gap-x-2 border-b p-3 text-sm">
        <div className="flex flex-grow items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}
              </Text>
              {item.variant.sku && <span>(item.variant.sku)</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant.title}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle txt-small flex flex-shrink-0">
          <MoneyAmountCell currencyCode={currencyCode} amount={item.total} />
        </div>

        <div className="flex items-center">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.remove"),
                    icon: <Trash />,
                    // onClick: () => onRemove(item.id),
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="block p-3 text-sm">
        <div className="flex justify-between gap-x-2">
          <div className="flex-1">
            <Text weight="plus" className="txt-small mb-2">
              {t("fields.quantity")}
            </Text>
            <Form.Field
              control={form.control}
              name={`quantity.${item.id}`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="bg-ui-bg-base txt-small w-full rounded-lg"
                        defaultValue={item.quantity}
                        min={1}
                        max={item.quantity}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === "") {
                            form.setValue(`quantity.${item.id}`, null)
                          } else {
                            form.setValue(`quantity.${item.id}`, Number(val))
                          }
                        }}
                        onBlur={() => {
                          if (
                            typeof form.getValues()[`quantity.${item.id}`] ===
                            "undefined"
                          ) {
                            form.setValue(`quantity.${item.id}`, 1)
                          }
                          onQuantityChangeComplete(item.id)
                        }}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>

          <div className="flex-1">
            <Text weight="plus" className="txt-small mb-2">
              {t("fields.reason")}
            </Text>
            <Form.Field
              control={form.control}
              name={`reason-${item.id}`}
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger
                          className="bg-ui-bg-base txt-small"
                          ref={ref}
                        >
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {return_reasons.map((i) => (
                            <Select.Item key={i.id} value={i.id}>
                              {i.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>

          <div className="flex-1">
            <Text weight="plus" className="txt-small mb-2">
              {t("fields.note")}
            </Text>
            <Form.Field
              control={form.control}
              name={`note-${item.id}`}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input className="bg-ui-bg-base txt-small" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { ReturnItem }
