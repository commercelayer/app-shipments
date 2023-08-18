import { ShipmentProgress } from '#components/ShipmentProgress'
import { appRoutes } from '#data/routes'
import { usePickingList } from '#hooks/usePickingList'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { useTriggerAttribute } from '#hooks/useTriggerAttribute'
import { useViewStatus } from '#hooks/useViewStatus'
import {
  A,
  ActionButtons,
  Hr,
  Legend,
  LineItems,
  ShipmentParcels,
  Spacer,
  useCoreSdkProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import { type Shipment as ShipmentResource } from '@commercelayer/sdk'
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
        <LineItems items={pickingList} />
        <ParcelList shipment={shipment} showTitle={pickingList.length > 0} />
        <ActionButtons
          actions={
            viewStatus.footerActions?.map(
              ({ label, triggerAttribute, disabled, variant }) => ({
                label,
                disabled,
                variant,
                onClick: async () => {
                  if (triggerAttribute === '_create_parcel') {
                    if (shipment.status !== 'packing') {
                      await trigger('_packing')
                    }

                    setLocation(appRoutes.packing.makePath(shipment.id))
                    return
                  }

                  if (triggerAttribute === '_get_rates') {
                    setLocation(appRoutes.purchase.makePath(shipment.id))
                    return
                  }

                  void trigger(triggerAttribute)
                }
              })
            ) ?? []
          }
        />
      </>
    )
  }
)

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
