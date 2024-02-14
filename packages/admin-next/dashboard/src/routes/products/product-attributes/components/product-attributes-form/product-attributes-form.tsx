import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdateProduct } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { CountrySelect } from "../../../../../components/common/country-select"
import { Form } from "../../../../../components/common/form"

type ProductAttributesFormProps = {
  product: Product
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const ProductAttributesSchema = zod.object({
  weight: zod.string(),
  length: zod.string(),
  width: zod.string(),
  height: zod.string(),
  mid_code: zod.string(),
  hs_code: zod.string(),
  origin_country: zod.string(),
})

export const ProductAttributesForm = ({
  product,
  subscribe,
  onSuccessfulSubmit,
}: ProductAttributesFormProps) => {
  const form = useForm<zod.infer<typeof ProductAttributesSchema>>({
    defaultValues: {
      height: product.height ? product.height.toString() : "",
      width: product.width ? product.width.toString() : "",
      length: product.length ? product.length.toString() : "",
      weight: product.weight ? product.weight.toString() : "",
      mid_code: product.mid_code || "",
      hs_code: product.hs_code || "",
      origin_country: product.origin_country || "",
    },
    resolver: zodResolver(ProductAttributesSchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty, subscribe])

  const { t } = useTranslation()
  const { mutateAsync, isLoading } = useAdminUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {},
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <Drawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="width"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.width")}</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          min={0}
                          value={value || ""}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === "") {
                              onChange(null)
                            } else {
                              onChange(parseFloat(value))
                            }
                          }}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="height"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.height")}</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          min={0}
                          value={value || ""}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === "") {
                              onChange(null)
                            } else {
                              onChange(parseFloat(value))
                            }
                          }}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="length"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.length")}</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          min={0}
                          value={value || ""}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === "") {
                              onChange(null)
                            } else {
                              onChange(parseFloat(value))
                            }
                          }}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="weight"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.weight")}</Form.Label>
                      <Form.Control>
                        <Input
                          type="number"
                          min={0}
                          value={value || ""}
                          onChange={(e) => {
                            const value = e.target.value

                            if (value === "") {
                              onChange(null)
                            } else {
                              onChange(parseFloat(value))
                            }
                          }}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="mid_code"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.midCode")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="hs_code"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.hsCode")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="origin_country"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.countryOfOrigin")}</Form.Label>
                      <Form.Control>
                        <CountrySelect {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
