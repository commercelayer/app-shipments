import { isMockedId, makeShipment } from '#mocks'
import { useCoreApi } from '@commercelayer/app-elements'

export const shipmentIncludeAttribute = [
  'order',
  'shipping_method',
  'shipping_address',
  'stock_location',
  'origin_address',
  'stock_line_items',
  'stock_line_items.sku',

  'parcels',
  'parcels.package',
  'parcels.parcel_line_items',

  'carrier_accounts'
]

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useShipmentDetails(
  id: string,
  paused: boolean = false,
  shouldRevalidate: boolean = true
) {
  const {
    data: shipment,
    isLoading,
    mutate: mutateShipment,
    isValidating
  } = useCoreApi(
    'shipments',
    'retrieve',
    [id, { include: shipmentIncludeAttribute }],
    {
      isPaused: () => isMockedId(id) || paused,
      fallbackData: makeShipment(),
      ...(shouldRevalidate
        ? {}
        : {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnMount: true,
            revalidateOnReconnect: false
          })
    }
  )

  return {
    shipment,
    isLoading,
    mutateShipment,
    isValidating
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useShipmentRates(shipmentId: string) {
  const { isLoading: isRefreshing } = useCoreApi(
    'shipments',
    'update',
    [
      {
        id: shipmentId,
        _get_rates: true
      },
      { include: shipmentIncludeAttribute }
    ],
    {
      isPaused: () => isMockedId(shipmentId),
      fallbackData: makeShipment(),
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false
    }
  )

  return {
    isRefreshing
  }
}
