import { Button, Spacer } from '@commercelayer/app-elements'
import { Form, ValidationApiError } from '@commercelayer/app-elements-hook-form'
import { type StockLineItem } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { z } from 'zod'
import { FormFieldItems } from './FormFieldItems'
import { FormFieldPackages } from './FormFieldPackages'
import { FormFieldWeight, allowedUnitsOfWeight } from './FormFieldWeight'

const packingFormSchema = z.object({
  packageId: z.string().nonempty({
    message: 'Please select a package'
  }),
  weight: z.string().nonempty({
    message: 'Please enter a weight'
  }),
  unitOfWeight: z.enum(allowedUnitsOfWeight),
  items: z
    .array(
      z.object({
        value: z.string().nonempty(),
        quantity: z.number()
      })
    )
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: 'array',
          inclusive: true,
          message: 'Please select at least one item'
        })
      }
    })
})

export type PackingFormValues = z.infer<typeof packingFormSchema>

interface Props {
  defaultValues: PackingFormValues
  isSubmitting?: boolean
  onSubmit: (
    formValues: PackingFormValues,
    setError: UseFormSetError<PackingFormValues>
  ) => void
  apiError?: any
  stockLineItems: StockLineItem[]
  stockLocationId: string
}

export function FormPacking({
  onSubmit,
  defaultValues,
  apiError,
  isSubmitting,
  stockLocationId,
  stockLineItems
}: Props): JSX.Element {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(packingFormSchema)
  })

  useEffect(
    function resetFormStateOnSuccessSubmit() {
      if (apiError == null) {
        methods.reset(defaultValues)
      }
    },
    [defaultValues, apiError]
  )

  return (
    <Form
      {...methods}
      onSubmit={(values) => {
        onSubmit(values, methods.setError)
      }}
    >
      <Spacer bottom='12'>
        <FormFieldPackages stockLocationId={stockLocationId} />
      </Spacer>
      <Spacer bottom='12'>
        <FormFieldItems stockLineItems={stockLineItems} />
      </Spacer>
      <Spacer bottom='12'>
        <FormFieldWeight />
      </Spacer>
      <Button type='submit' fullWidth disabled={isSubmitting}>
        Pack · {methods.watch('items').reduce((acc, i) => acc + i.quantity, 0)}
      </Button>
      <ValidationApiError
        apiError={apiError}
        fieldMap={{
          package: 'packageId',
          stock_line_item: 'items',
          unit_of_weight: 'unitOfWeight'
        }}
      />
    </Form>
  )
}
