import type { PackingFormDefaultValues } from '#components/FormPacking'
import { makeShipment, makeSku, makeStockItem, makeStockLineItem } from '#mocks'
import type { Shipment } from '@commercelayer/sdk'
import {
  getAvailableUnitsOfWeight,
  getSkuFromSelectItem,
  getTotalWeight
} from './useSyncFormPackingWeight'

describe('getSkuFromSelectItem', () => {
  it('should return the sku from the selected item', () => {
    const shipment = {
      ...makeShipment(),
      stock_line_items: [
        {
          ...makeStockLineItem(),
          id: 'myLineItemId',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku123'
            }
          }
        }
      ]
    }
    expect(
      getSkuFromSelectItem({
        selectedItem: { value: 'myLineItemId', quantity: 4 },
        shipment
      })?.id
    ).toBe('sku123')
  })
})

describe('getAvailableUnitsOfWeight', () => {
  it('Should return an array of units of weight', () => {
    const shipment: Shipment = {
      ...makeShipment(),
      stock_line_items: [
        {
          ...makeStockLineItem(),
          id: 'firstLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku1',
              unit_of_weight: 'gr'
            }
          }
        },
        {
          ...makeStockLineItem(),
          id: 'secondLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku2',
              unit_of_weight: 'gr'
            }
          }
        },
        {
          ...makeStockLineItem(),
          id: 'thirdLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku3',
              unit_of_weight: null
            }
          }
        },
        {
          ...makeStockLineItem(),
          id: 'forthLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku3',
              // @ts-expect-error empty string is not part of the interface
              unit_of_weight: ''
            }
          }
        }
      ]
    }
    const formValues: PackingFormDefaultValues = {
      items: [
        {
          value: 'firstLineItem',
          quantity: 4
        },
        {
          value: 'secondLineItem',
          quantity: 2
        },
        {
          value: 'thirdLineItem',
          quantity: 1
        },
        {
          value: 'forthLineItem',
          quantity: 1
        }
      ],
      packageId: '',
      weight: ''
    }
    expect(getAvailableUnitsOfWeight(shipment, formValues)).toEqual([
      'gr',
      undefined
    ])
  })
})

describe('getTotalWeight', () => {
  it('should return the total weight of the selected items', () => {
    const shipment: Shipment = {
      ...makeShipment(),
      stock_line_items: [
        {
          ...makeStockLineItem(),
          id: 'firstLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku1',
              unit_of_weight: 'gr',
              weight: 100
            }
          }
        },
        {
          ...makeStockLineItem(),
          id: 'secondLineItem',
          stock_item: {
            ...makeStockItem(),
            sku: {
              ...makeSku(),
              id: 'sku2',
              unit_of_weight: 'gr',
              weight: 150
            }
          }
        }
      ]
    }

    const formValues: PackingFormDefaultValues = {
      items: [
        {
          value: 'firstLineItem',
          quantity: 4
        },
        {
          value: 'secondLineItem',
          quantity: 2
        }
      ],
      packageId: '',
      weight: ''
    }

    expect(getTotalWeight(shipment, formValues)).toBe('700')
  })
})
