import { getShipmentStatusName } from '#data/dictionaries'
import type { BadgeProps } from '@commercelayer/app-elements'
import type { IconProps } from '@commercelayer/app-elements/dist/ui/atoms/Icon'
import type { Shipment } from '@commercelayer/sdk'

interface DisplayStatus {
  status: Shipment['status']
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  badgeVariant: BadgeProps['variant']
}

export function getDisplayStatus(shipment: Shipment): DisplayStatus {
  switch (shipment.status) {
    case 'picking':
      return {
        status: shipment.status,
        label: getShipmentStatusName(shipment.status),
        icon: 'arrowDown',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'packing':
      return {
        status: shipment.status,
        label: getShipmentStatusName(shipment.status),
        icon: 'package',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'ready_to_ship':
      return {
        status: shipment.status,
        label: getShipmentStatusName(shipment.status),
        icon: 'arrowUpRight',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'on_hold':
      return {
        status: shipment.status,
        label: getShipmentStatusName(shipment.status),
        icon: 'hourglass',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'shipped':
      return {
        status: shipment.status,
        label: getShipmentStatusName(shipment.status),
        icon: 'check',
        color: 'green',
        badgeVariant: 'success-solid'
      }

    default:
      return {
        status: shipment.status,
        label: shipment.status,
        icon: 'warning',
        color: 'gray',
        badgeVariant: 'secondary-solid'
      }
  }
}
