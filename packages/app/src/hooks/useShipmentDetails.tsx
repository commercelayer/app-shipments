import { isMockedId, makeShipment } from '#mocks'
import { useCoreApi } from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'
import type { KeyedMutator } from 'swr'

export function useShipmentDetails(id: string): {
  shipment: Shipment
  isLoading: boolean
  mutateShipment: KeyedMutator<Shipment>
} {
  const {
    data: shipment,
    isLoading,
    mutate: mutateShipment
  } = useCoreApi('shipments', 'retrieve', [id], {
    isPaused: () => isMockedId(id),
    fallbackData: makeShipment()
  })

  return { shipment, isLoading, mutateShipment }
}
