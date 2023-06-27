import {
  A,
  Avatar,
  Hr,
  Legend,
  ListItem,
  Progress,
  ShipmentParcels,
  Spacer,
  Text,
  useCoreApi,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { ListItemProps } from '@commercelayer/app-elements/dist/ui/lists/ListItem'
import {
  type Shipment as ShipmentResource,
  type Sku as SkuResource,
  type StockLineItem as StockLineItemResource
} from '@commercelayer/sdk'
import { useMemo } from 'react'

interface Props {
  shipment: ShipmentResource
}

export const ShipmentList = withSkeletonTemplate<Props>(
  ({ shipment, isLoading }) => {
    const skuCodes = useMemo(
      () => shipment.stock_line_items?.map((item) => item.sku_code) ?? [],
      [shipment]
    )

    const { data: skus } = useCoreApi(
      'skus',
      'list',
      skuCodes.length > 0
        ? [
            {
              filters: {
                code_in: skuCodes?.join(',')
              }
            }
          ]
        : null
    )

    const packingList = useMemo(
      () =>
        shipment.stock_line_items?.filter(
          (stockLineItem) =>
            shipment.parcels?.find((parcel) =>
              parcel.parcel_line_items?.find(
                (parcelLineItems) =>
                  parcelLineItems.sku_code === stockLineItem.sku_code
              )
            ) == null
        ) ?? [],
      [shipment.stock_line_items, shipment.parcels]
    )

    const listStatus = useMemo(() => {
      if (shipment.status === 'shipped') {
        return 'packed'
      }

      if (shipment.status === 'packing') {
        if (shipment.parcels != null && shipment.parcels.length > 0) {
          if (packingList.length > 0) {
            return 'in_progress'
          }

          return 'packed'
        }

        return 'packing'
      }

      return 'list'
    }, [shipment])

    const progress = useMemo(() => {
      const max =
        shipment.stock_line_items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) ?? 0

      const value =
        max - packingList.reduce((sum, item) => sum + item.quantity, 0) ?? 0

      return {
        value,
        max,
        percentage: (value / max) * 100
      }
    }, [shipment])

    if (isLoading === true) {
      return null
    }

    return (
      <>
        <Legend
          title={
            listStatus === 'packing' || listStatus === 'in_progress'
              ? 'Packing'
              : listStatus === 'packed'
              ? 'Parcels'
              : 'Picking list'
          }
          actionButton={
            listStatus === 'in_progress' ? (
              <A>Continue</A>
            ) : listStatus === 'packing' ? (
              <A>Start packing</A>
            ) : null
          }
        />
        {(listStatus === 'in_progress' || listStatus === 'packing') && (
          <>
            <Spacer top='4' bottom='4'>
              <Progress value={progress.value} max={progress.max}>
                {progress.percentage}%
              </Progress>
            </Spacer>
            <Hr />
          </>
        )}
        <Spacer top='4'>
          {packingList.map((stockLineItem, index) => {
            return (
              <StockLineItem
                key={stockLineItem.id}
                borderStyle={
                  packingList.length - 1 === index ? 'solid' : 'dashed'
                }
                sku={skus?.find((sku) => sku.code === stockLineItem.sku_code)}
                stockLineItem={stockLineItem}
              />
            )
          })}
        </Spacer>
        <ParcelList shipment={shipment} showTitle={listStatus !== 'packed'} />
      </>
    )
  }
)

const StockLineItem = withSkeletonTemplate<{
  stockLineItem: StockLineItemResource
  sku?: SkuResource
  borderStyle: ListItemProps['borderStyle']
}>(({ stockLineItem, sku, borderStyle }) => (
  <ListItem
    tag='div'
    alignItems='top'
    key={stockLineItem.id}
    borderStyle={borderStyle}
    gutter='none'
    icon={
      <Avatar
        alt={sku?.name ?? ''}
        src={sku?.image_url as `https://${string}`}
      />
    }
  >
    <div>
      <Text size='small' tag='div' variant='info' weight='medium'>
        {stockLineItem.sku_code}
      </Text>
      <Text tag='div' weight='bold'>
        {sku?.name}
      </Text>
    </div>
    <div>
      <Text size='small' tag='div' variant='info' weight='medium'>
        &nbsp;
      </Text>
      <Text tag='div' weight='bold' wrap='nowrap'>
        x {stockLineItem.quantity}
      </Text>
    </div>
  </ListItem>
))

const ParcelList = withSkeletonTemplate<{
  shipment: ShipmentResource
  showTitle: boolean
}>(({ shipment, showTitle }) => {
  if ((shipment.parcels ?? []).length <= 0) {
    return null
  }

  return (
    <Spacer top='8'>
      {showTitle && <Legend titleSize='small' title='Parcels' border='none' />}
      <ShipmentParcels
        shipment={shipment}
        onRemoveParcel={(id) => {
          alert(`Remove ${id}`)
        }}
      />
    </Spacer>
  )
})
