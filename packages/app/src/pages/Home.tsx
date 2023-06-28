import { getShipmentStatusName } from '#data/dictionaries'
import { filtersInstructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import { useHomeCounters } from '#hooks/useHomeCounters'
import {
  Icon,
  List,
  ListItem,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  Text,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useFilters } from '@commercelayer/app-elements-hook-form'
import type { Shipment } from '@commercelayer/sdk'
import { useCallback } from 'react'
import { Link, useLocation } from 'wouter'
import { useSearch } from 'wouter/use-location'

export function Home(): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()

  const search = useSearch()
  const [, setLocation] = useLocation()

  const counters = useHomeCounters()

  const { SearchWithNav, adapters } = useFilters({
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

      <Spacer bottom='14'>
        <List title='Pending'>
          <Link href={getPresetUrlByStatus('picking')}>
            <ListItem
              tag='a'
              icon={<Icon name='arrowDown' background='orange' gap='small' />}
            >
              <LabelWithCounter
                label={getShipmentStatusName('picking')}
                counter={counters.picking}
              />
              <Icon name='caretRight' />
            </ListItem>
          </Link>

          <Link href={getPresetUrlByStatus('packing')}>
            <ListItem
              tag='a'
              icon={<Icon name='package' background='orange' gap='small' />}
            >
              <LabelWithCounter
                label={getShipmentStatusName('packing')}
                counter={counters.packing}
              />
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
              <LabelWithCounter
                label={getShipmentStatusName('ready_to_ship')}
                counter={counters.readyToShip}
              />
              <Icon name='caretRight' />
            </ListItem>
          </Link>

          <Link href={getPresetUrlByStatus('on_hold')}>
            <ListItem
              tag='a'
              icon={<Icon name='hourglass' background='orange' gap='small' />}
            >
              <LabelWithCounter
                label={getShipmentStatusName('on_hold')}
                counter={counters.onHold}
              />
              <Icon name='caretRight' />
            </ListItem>
          </Link>
        </List>
      </Spacer>

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

function LabelWithCounter({
  label,
  counter
}: {
  label: string
  counter?: number
}): JSX.Element {
  return (
    <SkeletonTemplate isLoading={counter == null}>
      <Text weight='semibold'>
        {label} ({counter ?? '0'})
      </Text>
    </SkeletonTemplate>
  )
}
