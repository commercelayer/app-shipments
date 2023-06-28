import { ListItemShipment } from '#components/ListItemShipment'
import { filtersInstructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import {
  EmptyState,
  PageLayout,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useFilters } from '@commercelayer/app-elements-hook-form'
import { useLocation } from 'wouter'
import { navigate, useSearch } from 'wouter/use-location'

export function ShipmentList(): JSX.Element {
  const {
    settings: { mode }
  } = useTokenProvider()
  const [, setLocation] = useLocation()

  const queryString = useSearch()
  const { SearchWithNav, FilteredList, viewTitle } = useFilters({
    instructions: filtersInstructions
  })
  const isInViewPreset = viewTitle != null

  return (
    <PageLayout
      title={viewTitle ?? 'Shipments'}
      mode={mode}
      gap={isInViewPreset ? undefined : 'only-top'}
      onGoBack={() => {
        setLocation(appRoutes.home.makePath())
      }}
    >
      <SearchWithNav
        queryString={queryString}
        onUpdate={(qs) => {
          navigate(`?${qs}`, {
            replace: true
          })
        }}
        onFilterClick={(queryString) => {
          setLocation(appRoutes.filters.makePath(queryString))
        }}
        hideFiltersNav={isInViewPreset}
        hideSearchBar={isInViewPreset}
      />

      <Spacer bottom='14'>
        <FilteredList
          type='shipments'
          Item={ListItemShipment}
          query={{
            fields: {
              shipments: ['id', 'number', 'updated_at', 'status', 'order'],
              orders: ['market', 'shipments'],
              markets: ['name']
            },
            include: ['order', 'order.market', 'order.shipments'],
            pageSize: 25,
            sort: {
              updated_at: 'desc'
            }
          }}
          emptyState={
            <EmptyState
              title='No shipments found!'
              description={
                <div>
                  {isInViewPreset ? (
                    <p>There are no shipments for the current list.</p>
                  ) : (
                    <p>
                      We didn't find any shipments matching the current
                      selection.
                    </p>
                  )}
                </div>
              }
            />
          }
        />
      </Spacer>
    </PageLayout>
  )
}
