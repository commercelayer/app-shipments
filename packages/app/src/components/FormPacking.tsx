import { FormFieldsCustomsInfo } from '#components/FormFieldsCustomsInfo'
import {
  getContentType,
  getDeliveryConfirmation,
  getIncotermsRule,
  getNonDeliveryOption,
  getRestrictionType
} from '#data/parcelCustomsInfo'
import {
  Button,
  HookedForm,
  HookedValidationApiError,
  Spacer,
  useIsChanged
} from '@commercelayer/app-elements'
import { type Shipment, type StockLineItem } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import { useState } from 'react'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { z } from 'zod'
import { FormFieldItems } from './FormFieldItems'
import { FormFieldPackages } from './FormFieldPackages'
import { FormFieldWeight } from './FormFieldWeight'

const packingFormSchema = z
  .object({
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
      }),
    // more options
    incoterm: z.enum(getIncotermsRule().acceptedValues).nullish(),
    delivery_confirmation: z
      .enum(getDeliveryConfirmation().acceptedValues)
      .nullish(),
    // customs info
    customs_info_required: z.boolean().optional(),
    eel_pfc: z.string().optional(),
    contents_type: z.enum(getContentType().acceptedValues).nullish(),
    contents_explanation: z.string().optional(),
    non_delivery_option: z
      .enum(getNonDeliveryOption().acceptedValues)
      .nullish(),
    restriction_type: z.enum(getRestrictionType().acceptedValues).nullish(),
    restriction_comments: z.string().optional(),
    customs_signer: z.string().optional(),
    customs_certify: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    if (data.contents_type === 'other' && isEmpty(data.contents_explanation)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contents_explanation'],
        message: 'Please specify if "other" is selected'
      })
    }
    if (
      !isEmpty(data.restriction_type) &&
      data.restriction_type !== 'none' &&
      isEmpty(data.restriction_comments)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['restriction_comments'],
        message: "Please add a comment or select 'none' as restriction type"
      })
    }

    if (data.customs_info_required === true && isEmpty(data.customs_signer)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customs_signer'],
        message: 'Required when specifying a customs form value'
      })
    }
    if (data.customs_info_required === true && data.customs_certify !== true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customs_certify'],
        message: 'Required when specifying a customs form value'
      })
    }
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
      <Spacer bottom='8'>
        <FormFieldPackages stockLocationId={stockLocationId} />
      </Spacer>
      <Spacer bottom='8'>
        <FormFieldItems stockLineItems={stockLineItems} />
      </Spacer>
      <Spacer bottom='8'>
        <FormFieldWeight shipment={shipment} />
      </Spacer>
      <Spacer bottom='8'>
        <FormFieldsCustomsInfo />
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
