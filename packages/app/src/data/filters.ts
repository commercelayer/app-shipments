import { getShipmentStatusName } from '#data/dictionaries'
import type { FiltersInstructions } from '@commercelayer/app-elements/dist/ui/resources/Filters/types'
import type { Shipment } from '@commercelayer/sdk'

const allowedStatuses: Array<Shipment['status']> = [
  'picking',
  'packing',
  'ready_to_ship',
  'shipped',
  'on_hold'
]

const textSearchPredicate = ['number', 'reference'].join('_or_') + '_cont'

export const filtersInstructions: FiltersInstructions = [
  {
    label: 'Stock locations',
    type: 'options',
    sdk: {
      predicate: 'stock_location_id_in'
    },
    render: {
      component: 'relationshipSelector',
      props: {
        resource: 'stock_locations',
        fieldForLabel: 'name',
        fieldForValue: 'id',
        searchBy: 'name_cont',
        sortBy: { attribute: 'updated_at', direction: 'desc' },
        previewLimit: 5
      }
    }
  },
  {
    label: 'Status',
    type: 'options',
    sdk: {
      predicate: 'status_in',
      defaultOptions: allowedStatuses
    },
    render: {
      component: 'toggleButtons',
      props: {
        mode: 'multi',
        options: allowedStatuses.map((status) => ({
          value: status,
          label: getShipmentStatusName(status)
        }))
      }
    }
  },
  {
    label: 'Time Range',
    type: 'timeRange',
    sdk: {
      predicate: 'updated_at'
    },
    render: {
      component: 'dateRangePicker'
    }
  },
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: textSearchPredicate
    },
    render: {
      component: 'searchBar'
    }
  }
]
