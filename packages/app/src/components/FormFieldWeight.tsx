import { Grid } from '@commercelayer/app-elements'
import { Input, InputSelect } from '@commercelayer/app-elements-hook-form'

// TODO: this should come from sdk `Sku` interface
export const allowedUnitsOfWeight = ['gr', 'lb', 'oz'] as const

export function FormFieldWeight(): JSX.Element {
  return (
    <Grid columns='2'>
      <Input label='Weight' name='weight' />
      <InputSelect
        name='unitOfWeight'
        label='Unit of weight'
        initialValues={[
          {
            value: 'gr',
            label: 'grams'
          },
          {
            value: 'lb',
            label: 'pounds'
          },
          {
            value: 'oz',
            label: 'ounces'
          }
        ]}
      />
    </Grid>
  )
}
