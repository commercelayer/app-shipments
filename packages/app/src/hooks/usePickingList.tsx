import type { Parcel, Shipment, StockLineItem } from '@commercelayer/sdk'
import { useMemo } from 'react'
import { useActiveStockTransfers } from './useActiveStockTransfers'

function parcelsToStockLineItems(parcels: Parcel[]): StockLineItem[] {
  const stockLineItems: Record<string, StockLineItem> = {}

  for (const parcel of parcels) {
    for (const parcelLineItem of parcel.parcel_line_items ?? []) {
      if (parcelLineItem.sku_code == null) {
        break
      }

      const stockLineItem = stockLineItems[parcelLineItem.sku_code]

      if (stockLineItem != null) {
        stockLineItem.quantity += parcelLineItem.quantity
      } else {
        stockLineItems[parcelLineItem.sku_code] = {
          ...parcelLineItem,
          type: 'stock_line_items',
          quantity: parcelLineItem.quantity ?? 0
        }
      }
    }
  }

  return Object.values(stockLineItems)
}

/**
 * The picking list is the list of items that are not yet packed into a Parcel.
 * @param shipment Shipment resource from SDK
 * @returns Array of StockLineItem resource
 */
export function usePickingList(shipment: Shipment): StockLineItem[] {
  const activeStockTransfers = useActiveStockTransfers(shipment)

  return useMemo(
    () =>
      shipment.stock_line_items
        ?.map((stockLineItem) => {
          const stockLineItemsFromParcels = parcelsToStockLineItems(
            shipment.parcels ?? []
          )

          const parcelQuantity: number =
            stockLineItemsFromParcels.find(
              (item) => item.sku_code === stockLineItem.sku_code
            )?.quantity ?? 0

          const stockLineItemStockTransfer =
            activeStockTransfers.filter(
              (stockTransfer) =>
                stockTransfer.sku_code === stockLineItem.sku_code
            )[0] ?? undefined

          return {
            ...stockLineItem,
            stockTransfer: stockLineItemStockTransfer,
            quantity: stockLineItem.quantity - parcelQuantity
          }
        })
        .filter((stockLineItem) => stockLineItem.quantity > 0) ?? [],
    [shipment.stock_line_items, shipment.parcels]
  )
}
