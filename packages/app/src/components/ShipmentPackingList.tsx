import { ShipmentProgress } from '#components/ShipmentProgress'
import { usePickingList } from '#hooks/usePickingList'
import { useViewStatus } from '#hooks/useViewStatus'
import {
  A,
  ActionButtons,
  Avatar,
  Badge,
  Legend,
  ListItem,
  ShipmentParcels,
  Spacer,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { ListItemProps } from '@commercelayer/app-elements/dist/ui/lists/ListItem'
import {
  type Shipment as ShipmentResource,
  type StockLineItem as StockLineItemResource
} from '@commercelayer/sdk'

interface Props {
  shipment: ShipmentResource
}

export const ShipmentPackingList = withSkeletonTemplate<Props>(
  ({ shipment, isLoading }) => {
    const pickingList = usePickingList(shipment)
    const viewStatus = useViewStatus(shipment)

    if (isLoading === true) {
      return null
    }

    return (
      <>
        <Legend
          title={viewStatus.title}
          actionButton={
            viewStatus.headerAction == null ? null : (
              <A>{viewStatus.headerAction.label}</A>
            )
          }
        />
        {viewStatus.progress === true && (
          <ShipmentProgress shipment={shipment} />
        )}
        {pickingList.map((stockLineItem, index) => {
          return (
            <StockLineItem
              key={stockLineItem.id}
              borderStyle={
                pickingList.length - 1 === index ? 'solid' : 'dashed'
              }
              stockLineItem={stockLineItem}
            />
          )
        })}
        <ParcelList shipment={shipment} showTitle={pickingList.length > 0} />
        <ActionButtons
          actions={
            viewStatus.footerActions?.map((fa) => ({
              ...fa,
              onClick: () => {}
            })) ?? []
          }
        />
      </>
    )
  }
)

const StockLineItem = withSkeletonTemplate<{
  stockLineItem: StockLineItemResource
  borderStyle: ListItemProps['borderStyle']
}>(({ stockLineItem, borderStyle }) => (
  <ListItem
    tag='div'
    alignItems='top'
    key={stockLineItem.id}
    borderStyle={borderStyle}
    gutter='none'
    icon={
      <Avatar
        // TODO: after Mike's changes we can use `stockLineItem?.sku?.name`
        alt={stockLineItem?.stock_item?.sku?.name ?? ''}
        src={stockLineItem?.stock_item?.sku?.image_url as `https://${string}`}
      />
    }
  >
    <div>
      <Text size='small' tag='div' variant='info' weight='medium'>
        {stockLineItem.sku_code}
      </Text>
      <Text tag='div' weight='bold'>
        {stockLineItem?.stock_item?.sku?.name}
      </Text>
      {stockLineItem.bundle_code != null && (
        <Badge
          label={`BUNDLE ${stockLineItem.bundle_code}`}
          variant='secondary'
        />
      )}
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
