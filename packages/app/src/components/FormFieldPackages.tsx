import { repeat } from '#mocks'
import {
  InputFeedback,
  InputRadioGroup,
  Spacer,
  Text,
  useCoreApi
} from '@commercelayer/app-elements'
import { ValidationError } from '@commercelayer/app-elements-hook-form'
import type { Package } from '@commercelayer/sdk'
import type { ListResponse } from '@commercelayer/sdk/lib/cjs/resource'
import { Controller } from 'react-hook-form'
import { makePackage } from 'src/mocks/resources/packages'

interface Props {
  /**
   * Will be used retrieve the available packages
   */
  stockLocationId: string
}

export function FormFieldPackages({ stockLocationId }: Props): JSX.Element {
  // TODO: when initial packages are more than 4, add a select
  const { data: packages, isLoading } = useCoreApi(
    'packages',
    'list',
    [
      {
        filters: {
          stock_location_id_eq: stockLocationId
        },
        pageSize: 4
      }
    ],
    {
      fallbackData: repeat(2, () => makePackage()) as ListResponse<Package>
    }
  )

  if (packages.length === 0) {
    return (
      <InputFeedback message='No packages found for current stock location' />
    )
  }

  return (
    <>
      <Controller
        name='packageId'
        render={({ field: { onChange, value, name } }) => (
          <InputRadioGroup
            isLoading={isLoading}
            name={name}
            onChange={onChange}
            direction='row'
            showInput={false}
            defaultValue={value}
            options={packages.map((item) => ({
              value: item.id,
              content: (
                <>
                  <Spacer bottom='2'>
                    <Text weight='bold' tag='div'>
                      {item.name}
                    </Text>
                  </Spacer>
                  <Text variant='info'>{makeSizeString(item)}</Text>
                </>
              )
            }))}
          />
        )}
      />
      <ValidationError name='packageId' />
    </>
  )
}

/**
 * Generate a string with the package size in the following formats:
 * 50 × 45.30 × 20 cm
 * In case of integer values, the decimal part is removed (eg: 20.00 => 20)
 */
function makeSizeString({
  width,
  length,
  height,
  unit_of_length: unit
}: Package): string {
  function roundIfInteger(value: string | number): string {
    const float = parseFloat(`${value}`)
    return Number.isInteger(float) ? float.toString() : float.toFixed(0)
  }

  return `${roundIfInteger(width)} × ${roundIfInteger(
    length
  )} × ${roundIfInteger(height)} ${unit}`
}
