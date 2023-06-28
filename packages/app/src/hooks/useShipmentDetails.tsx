import { isMockedId, makeShipment } from '#mocks'
import { useCoreApi } from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'
import type { KeyedMutator } from 'swr'

export const shipmentIncludeAttribute = [
  'order',
  'shipping_method',
  'shipping_address',
  'stock_location',
  'origin_address',
  'stock_line_items',
  'parcels',
  'parcels.package',
  'parcels.parcel_line_items'
]

export function useShipmentDetails(id: string): {
  shipment: Shipment
  isLoading: boolean
  mutateShipment: KeyedMutator<Shipment>
} {
  const {
    data: shipment,
    isLoading,
    mutate: mutateShipment
  } = useCoreApi(
    'shipments',
    'retrieve',
    [id, { include: shipmentIncludeAttribute }],
    {
      isPaused: () => isMockedId(id),
      fallbackData: makeShipment()
    }
  )

  // const {
  //   data: shipment,
  //   isLoading,
  //   mutate: mutateShipment
  // } = useCoreApi(
  //   'shipments',
  //   'update',
  //   [
  //     {
  //       id,
  //       _get_rates: true
  //     },
  //     { include: shipmentIncludeAttribute }
  //   ],
  //   {
  //     isPaused: () => isMockedId(id),
  //     fallbackData: makeShipment()
  //   }
  // )

  console.log('shipment', shipment)

  return {
    shipment,
    isLoading,
    mutateShipment
  }
}
