import { InputCheckboxList, Text } from '@commercelayer/app-elements'
import { ValidationError } from '@commercelayer/app-elements-hook-form'
import type { StockLineItem } from '@commercelayer/sdk'
import { Controller } from 'react-hook-form'
interface Props {
  stockLineItems: StockLineItem[]
}

export function FormFieldItems({ stockLineItems }: Props): JSX.Element {
  const options = stockLineItems.map((item) => ({
    value: item.id,
    content: (
      <>
        <Text size='regular' tag='div' weight='bold'>
          {item.stock_item?.sku?.code}
        </Text>
        {item.stock_item?.sku?.weight != null ? (
          <Text size='small' tag='div' variant='info'>
            {item.stock_item?.sku?.weight}
            {item.stock_item?.sku?.unit_of_weight}
          </Text>
        ) : null}
      </>
    ),
    image: {
      url: (item.stock_item?.sku?.image_url ?? '') as `https://${string}`,
      alt: item.stock_item?.sku?.name ?? ''
    },
    quantity: {
      min: 1,
      max: item.quantity ?? 1
    }
  }))

  if (options.length === 0) {
    return <div>No items</div>
  }

  return (
    <>
      <Controller
        name='items'
        render={({ field: { onChange, value } }) => (
          <InputCheckboxList
            title='Items'
            defaultValues={value}
            options={options}
            key={options.length}
            onChange={onChange}
          />
        )}
      />
      <ValidationError name='items' />
    </>
  )
}
