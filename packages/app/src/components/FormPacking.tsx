import {
  Button,
  HookedForm,
  HookedValidationApiError,
  Spacer,
  useIsChanged
} from '@commercelayer/app-elements'
import { type Shipment, type StockLineItem } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { z } from 'zod'
import { FormFieldItems } from './FormFieldItems'
import { FormFieldPackages } from './FormFieldPackages'
import { FormFieldWeight } from './FormFieldWeight'

const packingFormSchema = z.object({
  packageId: z.string().nonempty({
    message: 'Please select a package'
  }),
  weight: z.string().nonempty({
    message: 'Please enter a weight'
  }),
  unitOfWeight: z
    .enum(['gr', 'lb', 'oz'])
    .optional()
    .transform((val, ctx) => {
      if (val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a unit of weight'
        })

        return z.NEVER
      }
      return val
    }),
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
export type PackingFormDefaultValues = z.input<typeof packingFormSchema>

interface Props {
  defaultValues: PackingFormDefaultValues
  isSubmitting?: boolean
  onSubmit: (
    formValues: PackingFormValues,
    setError: UseFormSetError<PackingFormValues>
  ) => void
  apiError?: any
  stockLineItems: StockLineItem[]
  stockLocationId: string
  shipment: Shipment
}

export function FormPacking({
  onSubmit,
  shipment,
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

  // when stockLineItems changes, we need to re-render the form
  // to update defaults values for FormFieldItems and FormFieldPackages
  const [renderKey, setRenderKey] = useState(0)
  useIsChanged({
    value: stockLineItems,
    onChange: () => {
      setRenderKey(new Date().getTime())
    }
  })

  useIsChanged({
    value: defaultValues,
    onChange: () => {
      if (apiError == null) {
        methods.reset(defaultValues)
      }
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        // `zodResolver` does not recognize the z.output but is wrongly inferring types from `defaultValues`
        onSubmit(values as PackingFormValues, methods.setError)
      }}
      key={renderKey}
    >
      <Spacer bottom='12'>
        <FormFieldPackages stockLocationId={stockLocationId} />
      </Spacer>
      <Spacer bottom='12'>
        <FormFieldItems stockLineItems={stockLineItems} />
      </Spacer>
      <Spacer bottom='12'>
        <FormFieldWeight shipment={shipment} />
      </Spacer>
      <Button type='submit' fullWidth disabled={isSubmitting}>
        {isSubmitting === true
          ? 'Packing'
          : `Pack · ${methods
              .watch('items')
              .reduce((acc, i) => acc + i.quantity, 0)}`}
      </Button>
      <HookedValidationApiError
        apiError={apiError}
        fieldMap={{
          package: 'packageId',
          stock_line_item: 'items',
          unit_of_weight: 'unitOfWeight'
        }}
      />
    </HookedForm>
  )
}
