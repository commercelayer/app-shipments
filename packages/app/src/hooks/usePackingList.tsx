import type { Shipment, StockLineItem } from '@commercelayer/sdk'
import { useMemo } from 'react'

/**
 * The packing list is the list of items that are not yet packed into a Parcel.
 * @param shipment Shipment resource from SDK
 * @returns Array of StockLineItem resource
 */
export function usePackingList(shipment: Shipment): StockLineItem[] {
  return useMemo(
    () =>
      shipment.stock_line_items?.filter(
        (stockLineItem) =>
          shipment.parcels?.find((parcel) =>
            parcel.parcel_line_items?.find(
              (parcelLineItems) =>
                parcelLineItems.sku_code === stockLineItem.sku_code
            )
          ) == null
      ) ?? [],
    [shipment.stock_line_items, shipment.parcels]
  )
}
