import { Button, Spacer } from '@commercelayer/app-elements'
import { Form } from '@commercelayer/app-elements-hook-form'
import { type StockLineItem } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
  stockLocationId,
  stockLineItems
}: Props): JSX.Element {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(packingFormSchema)
  })

  useEffect(() => {
    methods.reset(defaultValues)
  }, [defaultValues])

  const [renderKey, setRenderKey] = useState(0)
  useEffect(() => {
    setRenderKey(new Date().getTime())
  }, [stockLineItems])

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
        <FormFieldItems key={renderKey} stockLineItems={stockLineItems} />
      </Spacer>
      <Spacer bottom='12'>
        <FormFieldWeight />
      </Spacer>
      {/* TODO handle form api errors */}
      <Button type='submit' fullWidth>
        Pack · {methods.watch('items').reduce((acc, i) => acc + i.quantity, 0)}
      </Button>
    </Form>
  )
}
