import { type PackingFormValues } from '#components/FormPacking'
import {
  getContentType,
  getDeliveryConfirmation,
  getIncotermsRule,
  getNonDeliveryOption,
  getRestrictionType
} from '#data/parcelCustomsInfo'
import {
  Card,
  HookedInput,
  HookedInputCheckbox,
  HookedInputSelect,
  Legend,
  Spacer,
  Text
} from '@commercelayer/app-elements'
import isEmpty from 'lodash/isEmpty'
import { useEffect, type FC, type ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

export const FormFieldsCustomsInfo: FC = () => {
  const { watch, setValue } = useFormContext<PackingFormValues>()

  const contentTypeValue = watch('contents_type')
  const restrictionTypeValue = watch('restriction_type')

  useEffect(
    function emptyOtherExplanation() {
      if (contentTypeValue !== 'other') {
        setValue('contents_explanation', undefined)
      }
      if (restrictionTypeValue !== 'other') {
        setValue('restriction_comments', undefined)
      }
    },
    [contentTypeValue, restrictionTypeValue]
  )

  return (
    <fieldset>
      <Spacer bottom='4'>
        <Legend>More info</Legend>
      </Spacer>

      <OptionsGroup
        label='Incoterms rules'
        fieldsToReset={['incoterm']}
        name='incotermOptionsGroup'
      >
        <HookedInputSelect
          name='incoterm'
          initialValues={getIncotermsRule().selectOptions}
          placeholder='Select an option'
          isClearable
        />
      </OptionsGroup>

      <OptionsGroup
        label='Delivery confirmations'
        fieldsToReset={['delivery_confirmation']}
        name='deliveryOptionsGroup'
      >
        <HookedInputSelect
          name='delivery_confirmation'
          initialValues={getDeliveryConfirmation().selectOptions}
          placeholder='Select an option'
          isClearable
        />
      </OptionsGroup>

      <OptionsGroup
        label='Require custom forms'
        name='customs_info_required'
        fieldsToReset={[
          'eel_pfc',
          'contents_type',
          'contents_explanation',
          'non_delivery_option',
          'restriction_type',
          'restriction_comments',
          'customs_signer'
        ]}
      >
        <Card overflow='visible' backgroundColor='light'>
          <Spacer bottom='4'>
            <HookedInput name='eel_pfc' label='EEL/PFC' />
          </Spacer>

          <Spacer bottom='4'>
            <HookedInputSelect
              name='contents_type'
              label='The type of item you are sending'
              initialValues={getContentType().selectOptions}
              isClearable
            />
          </Spacer>

          {contentTypeValue === 'other' && (
            <Spacer bottom='4'>
              <HookedInput
                name='contents_explanation'
                placeholder='Insert a brief description'
              />
            </Spacer>
          )}

          <Spacer bottom='4'>
            <HookedInputSelect
              name='non_delivery_option'
              label='In case the shipment cannot be delivered'
              initialValues={getNonDeliveryOption().selectOptions}
              isClearable
            />
          </Spacer>

          <Spacer bottom='4'>
            <HookedInputSelect
              name='restriction_type'
              label='Requires any special treatment'
              initialValues={getRestrictionType().selectOptions}
              isClearable
            />
          </Spacer>
          {!isEmpty(restrictionTypeValue) &&
            restrictionTypeValue !== 'none' && (
              <Spacer bottom='4'>
                <HookedInput
                  name='restriction_comments'
                  placeholder='Insert a brief description'
                />
              </Spacer>
            )}

          <Spacer bottom='4'>
            <HookedInput name='customs_signer' label='Customs signer' />
          </Spacer>

          <HookedInputCheckbox name='customs_certify'>
            <Text weight='semibold'>
              I confirm the provided information is accurate
            </Text>
          </HookedInputCheckbox>
        </Card>
      </OptionsGroup>
    </fieldset>
  )
}

/**
 * This component show a checkbox that when checked shows the children.
 * When the checkbox is unchecked, the children are unmounted and the fields
 * specified in `fieldsToReset` are emptied.
 */
const OptionsGroup: FC<{
  /** group label */
  label: string
  /** field name to control */
  name: string
  /** reset fields specified in the array when group is closed/unchecked */
  fieldsToReset: string[]
  /** children to render when open/checked */
  children: ReactNode
}> = ({ label, fieldsToReset, name, children }) => {
  const { setValue, formState, watch } = useFormContext()
  const isActive = Boolean(watch(name))

  useEffect(
    function openWhenChildInputHasError() {
      const hasErrorInside = fieldsToReset.some((field) => {
        return formState.errors[field]
      })
      if (hasErrorInside) {
        setValue(name, true)
      }
    },
    [formState.errors]
  )

  useEffect(
    function resetFieldsWhenClosed() {
      if (!isActive) {
        fieldsToReset.forEach((field) => {
          setValue(field, undefined)
        })
      }
    },
    [isActive]
  )

  return (
    <Spacer bottom='4'>
      <HookedInputCheckbox name={name}>
        <Text weight='semibold'>{label}</Text>
      </HookedInputCheckbox>

      {isActive && (
        <Spacer top='4' left='8'>
          {children}
        </Spacer>
      )}
    </Spacer>
  )
}
