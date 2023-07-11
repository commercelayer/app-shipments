import type { ActionButtonsProps } from '@commercelayer/app-elements/dist/ui/composite/ActionButtons'
import type { Shipment, ShipmentUpdate } from '@commercelayer/sdk'
import { useMemo } from 'react'
import { usePickingList } from './usePickingList'

type TriggerAttribute =
  | Extract<keyof ShipmentUpdate, `_${string}`>
  | '_create_parcel'

export type Action = Omit<ActionButtonsProps['actions'][number], 'onClick'> & {
  triggerAttribute: TriggerAttribute
}

interface ViewStatus {
  title: 'Picking list' | 'Packing' | 'Parcels'
  progress?: boolean
  headerAction?: Action
  footerActions?: Action[]
  contextActions?: Action[]
}

export function useViewStatus(shipment: Shipment): ViewStatus {
  const pickingList = usePickingList(shipment)
  const hasPickingItems = pickingList.length > 0
  const hasParcels = shipment.parcels != null && shipment.parcels.length > 0
  const hasBeenPurchased = shipment.purchase_started_at != null

  return useMemo(() => {
    const result: ViewStatus = {
      title: !hasPickingItems
        ? 'Parcels'
        : shipment.status === 'packing'
        ? 'Packing'
        : 'Picking list',
      progress: shipment.status === 'packing' && hasPickingItems
    }

    switch (shipment.status) {
      case 'picking':
        result.footerActions = [
          {
            label: 'Put on hold',
            variant: 'secondary',
            triggerAttribute: '_on_hold'
          },
          { label: 'Start packing', triggerAttribute: '_create_parcel' }
        ]
        break

      case 'packing':
        if (hasPickingItems) {
          result.headerAction = {
            label: hasParcels ? 'Continue' : 'Start packing',
            triggerAttribute: '_create_parcel'
          }
          result.contextActions = [
            { label: 'Back to picking', triggerAttribute: '_picking' }
          ]
        } else {
          if (!hasBeenPurchased) {
            result.contextActions = [
              { label: 'Mark as ready', triggerAttribute: '_ready_to_ship' }
            ]
            result.footerActions = [
              {
                label: 'Purchase labels',
                triggerAttribute: '_get_rates'
              }
            ]
          }
        }
        break

      case 'ready_to_ship':
        result.contextActions = hasBeenPurchased
          ? []
          : [
              {
                label: 'Back to packing',
                triggerAttribute: '_packing'
              }
            ]
        result.footerActions = hasBeenPurchased
          ? []
          : [
              {
                label: 'Mark as shipped',
                triggerAttribute: '_ship'
              }
            ]
        break

      case 'on_hold':
        result.footerActions = [
          { label: 'Start picking', triggerAttribute: '_picking' }
        ]
        break

      default:
        // Handle unknown status
        break
    }

    return result
  }, [shipment, hasPickingItems, hasParcels, hasBeenPurchased])
}
