import { useCoreApi } from '@commercelayer/app-elements'
import type { QueryParamsList, Shipment } from '@commercelayer/sdk'

export function useHomeCounters(): {
  picking?: number
  packing?: number
  readyToShip?: number
  onHold?: number
} {
  const options = {
    revalidateIfStale: false
  }

  const { data: picking } = useCoreApi(
    'shipments',
    'list',
    makeQueryParam('picking'),
    options
  )

  const { data: packing } = useCoreApi(
    'shipments',
    'list',
    makeQueryParam('packing'),
    options
  )

  const { data: readyToShip } = useCoreApi(
    'shipments',
    'list',
    makeQueryParam('ready_to_ship'),
    options
  )

  const { data: onHold } = useCoreApi(
    'shipments',
    'list',
    makeQueryParam('on_hold'),
    options
  )

  return {
    picking: picking?.meta?.recordCount,
    packing: packing?.meta?.recordCount,
    readyToShip: readyToShip?.meta?.recordCount,
    onHold: onHold?.meta?.recordCount
  }
}

function makeQueryParam(status: Shipment['status']): [QueryParamsList] {
  return [
    {
      fields: ['id'],
      filters: {
        status_in: status
      }
    }
  ]
}
