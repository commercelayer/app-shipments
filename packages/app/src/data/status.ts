import type { IconProps } from '@commercelayer/app-elements/dist/ui/atoms/Icon'
import type { Shipment } from '@commercelayer/sdk'

interface DisplayStatus {
  status: Shipment['status']
  label: string
  icon: IconProps['name']
  color: IconProps['background']
}

export function getDisplayStatus(shipment: Shipment): DisplayStatus {
  switch (shipment.status) {
    case 'picking':
      return {
        status: shipment.status,
        label: 'Picking',
        icon: 'arrowDown',
        color: 'orange'
      }

    case 'packing':
      return {
        status: shipment.status,
        label: 'Packing',
        icon: 'package',
        color: 'orange'
      }

    case 'ready_to_ship':
      return {
        status: shipment.status,
        label: 'Ready to ship',
        icon: 'arrowUpRight',
        color: 'orange'
      }

    case 'on_hold':
      return {
        status: shipment.status,
        label: 'On hold',
        icon: 'hourglass',
        color: 'orange'
      }

    case 'shipped':
      return {
        status: shipment.status,
        label: 'Shipped',
        icon: 'check',
        color: 'green'
      }

    default:
      return {
        status: shipment.status,
        label: shipment.status,
        icon: 'warning',
        color: 'gray'
      }
  }
}
