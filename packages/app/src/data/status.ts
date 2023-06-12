import type { BadgeVariant } from '@commercelayer/app-elements/dist/ui/atoms/Badge'
import type { IconProps } from '@commercelayer/app-elements/dist/ui/atoms/Icon'
import type { Shipment } from '@commercelayer/sdk'

interface DisplayStatus {
  status: Shipment['status']
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  badgeVariant: BadgeVariant
}

export function getDisplayStatus(shipment: Shipment): DisplayStatus {
  switch (shipment.status) {
    case 'picking':
      return {
        status: shipment.status,
        label: 'Picking',
        icon: 'arrowDown',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'packing':
      return {
        status: shipment.status,
        label: 'Packing',
        icon: 'package',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'ready_to_ship':
      return {
        status: shipment.status,
        label: 'Ready to ship',
        icon: 'arrowUpRight',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'on_hold':
      return {
        status: shipment.status,
        label: 'On hold',
        icon: 'hourglass',
        color: 'orange',
        badgeVariant: 'warning-solid'
      }

    case 'shipped':
      return {
        status: shipment.status,
        label: 'Shipped',
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
