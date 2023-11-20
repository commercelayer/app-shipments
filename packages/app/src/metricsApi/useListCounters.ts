import { presets, type ListType } from '#data/lists'
import { useTokenProvider } from '@commercelayer/app-elements'
import useSWR, { type SWRResponse } from 'swr'
import { metricsApiFetcher } from './fetcher'
import { getLastYearIsoRange } from './utils'

const fetchShipmentStats = async ({
  slug,
  accessToken,
  filters
}: {
  slug: string
  accessToken: string
  filters: object
}): Promise<VndApiResponse<MetricsApiShipmentsBreakdownData>> =>
  await metricsApiFetcher<MetricsApiShipmentsBreakdownData>({
    endpoint: '/orders/breakdown',
    slug,
    accessToken,
    body: {
      breakdown: {
        by: 'shipments.status',
        field: 'shipments.id',
        operator: 'value_count'
      },
      filter: {
        order: {
          ...getLastYearIsoRange(new Date()),
          date_field: 'updated_at'
        },
        ...filters
      }
    }
  })

const fetchAllCounters = async ({
  slug,
  accessToken
}: {
  slug: string
  accessToken: string
}): Promise<{
  picking: number
  packing: number
  readyToShip: number
  onHold: number
}> => {
  const lists: ListType[] = ['picking', 'packing', 'readyToShip', 'onHold']
  const listsStatuses = lists.map((listType) => presets[listType].status_eq)

  const allStats = await fetchShipmentStats({
    slug,
    accessToken,
    filters: {
      shipments: {
        statuses: {
          in: listsStatuses
        }
      }
    }
  })

  const stats = allStats.data

  return {
    picking: getShipmentsBreakdownCounterByStatus(stats, 'picking'),
    packing: getShipmentsBreakdownCounterByStatus(stats, 'packing'),
    readyToShip: getShipmentsBreakdownCounterByStatus(stats, 'ready_to_ship'),
    onHold: getShipmentsBreakdownCounterByStatus(stats, 'on_hold')
  }
}

export function useListCounters(): SWRResponse<{
  picking: number
  packing: number
  readyToShip: number
  onHold: number
}> {
  const {
    settings: { accessToken, organizationSlug }
  } = useTokenProvider()

  const swrResponse = useSWR(
    {
      slug: organizationSlug,
      accessToken
    },
    fetchAllCounters,
    {
      revalidateOnFocus: false
    }
  )

  return swrResponse
}

function getShipmentsBreakdownCounterByStatus(
  allStats: MetricsApiShipmentsBreakdownData,
  status: 'picking' | 'packing' | 'on_hold' | 'ready_to_ship'
): number {
  const stats = allStats['shipments.status']
  return stats?.filter((stat) => stat.label === status)[0]?.value ?? 0
}
