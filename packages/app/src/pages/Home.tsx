import { getShipmentStatusName } from '#data/dictionaries'
import { filtersInstructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import {
  Icon,
  List,
  ListItem,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  Text,
  useResourceFilters,
  useTokenProvider
} from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'
import { useCallback } from 'react'
import { Link, useLocation } from 'wouter'
import { useSearch } from 'wouter/use-location'
import { useListCounters } from '../metricsApi/useListCounters'

export function Home(): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()

  const search = useSearch()
  const [, setLocation] = useLocation()

  const { data: counters, isLoading: isLoadingCounters } = useListCounters()

  const { SearchWithNav, adapters } = useResourceFilters({
    instructions: filtersInstructions
  })

  const getPresetUrlByStatus = useCallback(
    (status: Shipment['status']): string => {
      return appRoutes.list.makePath(
        adapters.adaptFormValuesToUrlQuery({
          formValues: {
            status_in: [status],
            viewTitle: getShipmentStatusName(status)
          }
        })
      )
    },
    []
  )

  return (
    <PageLayout
      title='Shipments'
      mode={mode}
      gap='only-top'
      onGoBack={() => {
        window.location.href =
          dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
      }}
    >
      <SearchWithNav
        hideFiltersNav
        onFilterClick={() => {}}
        onUpdate={(qs) => {
          setLocation(appRoutes.list.makePath(qs))
        }}
        queryString={search}
      />

      <SkeletonTemplate isLoading={isLoadingCounters}>
        <Spacer bottom='14'>
          <List title='Pending'>
            <Link href={getPresetUrlByStatus('picking')}>
              <ListItem
                tag='a'
                icon={<Icon name='arrowDown' background='orange' gap='small' />}
              >
                <Text weight='semibold'>
                  Picking {formatCounter(counters?.picking)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link href={getPresetUrlByStatus('packing')}>
              <ListItem
                tag='a'
                icon={<Icon name='package' background='orange' gap='small' />}
              >
                <Text weight='semibold'>
                  Packing {formatCounter(counters?.packing)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link href={getPresetUrlByStatus('ready_to_ship')}>
              <ListItem
                tag='a'
                icon={
                  <Icon name='arrowUpRight' background='orange' gap='small' />
                }
              >
                <Text weight='semibold'>
                  Ready to ship {formatCounter(counters?.readyToShip)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link href={getPresetUrlByStatus('on_hold')}>
              <ListItem
                tag='a'
                icon={<Icon name='hourglass' background='orange' gap='small' />}
              >
                <Text weight='semibold'>
                  On hold {formatCounter(counters?.onHold)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
          </List>
        </Spacer>
      </SkeletonTemplate>

      <Spacer bottom='14'>
        <List title='Browse'>
          <Link href={appRoutes.list.makePath()}>
            <ListItem
              tag='a'
              icon={<Icon name='asterisk' background='black' gap='small' />}
            >
              <Text weight='semibold'>All shipments</Text>
              <Icon name='caretRight' />
            </ListItem>
          </Link>
        </List>
      </Spacer>
    </PageLayout>
  )
}

function formatCounter(counter = 0): string {
  return `(${Intl.NumberFormat().format(counter)})`
}
