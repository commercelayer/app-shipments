import { useSyncFormPackingWeight } from '#hooks/useSyncFormPackingWeight'
import { Grid } from '@commercelayer/app-elements'
import { Input, InputSelect } from '@commercelayer/app-elements-hook-form'
import type { Shipment } from '@commercelayer/sdk'
import { useFormContext } from 'react-hook-form'

export function FormFieldWeight({
  shipment
}: {
  shipment: Shipment
}): JSX.Element {
  const { watch } = useFormContext()
  useSyncFormPackingWeight({ shipment })

  return (
    <Grid columns='2'>
      <Input label='Weight' name='weight' />
      <InputSelect
        name='unitOfWeight'
        label='Unit of weight'
        key={watch('unitOfWeight')}
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
