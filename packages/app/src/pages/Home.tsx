import { getShipmentStatusName } from '#data/dictionaries'
import { filtersInstructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import {
  Icon,
  List,
  ListItem,
  PageLayout,
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
              <Text weight='semibold'>Picking</Text>
              <Icon name='caretRight' />
            </ListItem>
          </Link>

          <Link href={getPresetUrlByStatus('packing')}>
            <ListItem
              tag='a'
              icon={<Icon name='package' background='orange' gap='small' />}
            >
              <Text weight='semibold'>Packing</Text>
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
              <Text weight='semibold'>Ready to ship</Text>
              <Icon name='caretRight' />
            </ListItem>
          </Link>

          <Link href={getPresetUrlByStatus('on_hold')}>
            <ListItem
              tag='a'
              icon={<Icon name='hourglass' background='orange' gap='small' />}
            >
              <Text weight='semibold'>On hold</Text>
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
