import { ShipmentProgress } from '#components/ShipmentProgress'
import { appRoutes } from '#data/routes'
import { usePickingList } from '#hooks/usePickingList'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { useTriggerAttribute } from '#hooks/useTriggerAttribute'
import { useViewStatus } from '#hooks/useViewStatus'
import {
  A,
  ActionButtons,
  Avatar,
  Badge,
  Hr,
  Legend,
  ListItem,
  ShipmentParcels,
  Spacer,
  Text,
  useCoreSdkProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { ListItemProps } from '@commercelayer/app-elements/dist/ui/lists/ListItem'
import {
  type Shipment as ShipmentResource,
  type StockLineItem as StockLineItemResource
} from '@commercelayer/sdk'
import { Link, useLocation } from 'wouter'

interface Props {
  shipment: ShipmentResource
}

export const ShipmentPackingList = withSkeletonTemplate<Props>(
  ({ shipment, isLoading }) => {
    const [, setLocation] = useLocation()
    const { trigger } = useTriggerAttribute(shipment.id)
    const pickingList = usePickingList(shipment)
    const viewStatus = useViewStatus(shipment)

    if (isLoading === true) {
      return null
    }

    return (
      <>
        <Legend
          title={viewStatus.title}
          border={pickingList.length > 0 ? undefined : 'none'}
          actionButton={
            viewStatus.headerAction == null ? null : (
              <Link href={appRoutes.packing.makePath(shipment.id)}>
                <A>{viewStatus.headerAction.label}</A>
              </Link>
            )
          }
        />
        {viewStatus.progress === true && (
          <>
            <Spacer top='4' bottom='4'>
              <ShipmentProgress shipment={shipment} />
            </Spacer>
            <Hr />
          </>
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
            viewStatus.footerActions?.map((action) => ({
              ...action,
              onClick: async () => {
                if (action.triggerAttribute === '_create_parcel') {
                  if (shipment.status !== 'packing') {
                    await trigger('_packing')
                  }
                  setLocation(appRoutes.packing.makePath(shipment.id))
                  return
                }

                if (action.triggerAttribute === '_get_rates') {
                  setLocation(appRoutes.purchase.makePath(shipment.id))
                  return
                }

                void trigger(action.triggerAttribute)
              }
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
    padding='y'
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
  const { sdkClient } = useCoreSdkProvider()
  const { mutateShipment } = useShipmentDetails(shipment.id)

  if ((shipment.parcels ?? []).length <= 0) {
    return null
  }

  return (
    <Spacer top={showTitle ? '8' : undefined}>
      {showTitle && <Legend titleSize='small' title='Parcels' border='none' />}
      <ShipmentParcels
        shipment={shipment}
        onRemoveParcel={(id) => {
          void sdkClient.parcels
            .delete(id)
            .then(async () => await mutateShipment())
        }}
      />
    </Spacer>
  )
})
