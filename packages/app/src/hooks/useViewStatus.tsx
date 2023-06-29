import type { ActionButtonsProps } from '@commercelayer/app-elements/dist/ui/composite/ActionButtons'
import type { Shipment } from '@commercelayer/sdk'
import { useMemo } from 'react'
import { usePickingList } from './usePickingList'

type Action = Omit<ActionButtonsProps['actions'][number], 'onClick'>

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
  const hasTracking =
    shipment.parcels?.some((parcel) => parcel.tracking_number != null) ?? false

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
          { label: 'Put on hold', variant: 'secondary' },
          { label: 'Start packing' }
        ]
        break

      case 'packing':
        if (hasPickingItems) {
          result.headerAction = {
            label: hasParcels ? 'Continue' : 'Start packing'
          }
          result.contextActions = [{ label: 'Back to picking' }]
        } else {
          if (!hasTracking) {
            result.footerActions = [
              {
                label: 'Purchase labels'
              }
            ]
            result.contextActions = [{ label: 'Mark as ready' }]
          } else {
            result.footerActions = [
              {
                label: 'Mark as ready'
              }
            ]
          }
        }
        break

      case 'ready_to_ship':
        result.footerActions = [
          { label: 'Back to packing', variant: 'secondary' },
          { label: 'Mark as shipped' }
        ]
        break

      case 'on_hold':
        result.footerActions = [{ label: 'Start picking' }]
        break

      default:
        // Handle unknown status
        break
    }

    return result
  }, [shipment, hasPickingItems, hasParcels, hasTracking])
}
