import type { StockItem } from '@commercelayer/sdk'

export const makeStockItem = (): StockItem => {
  return {
    type: 'stock_items',
    id: 'fake-123',
    created_at: '',
    updated_at: '',
    quantity: 1
  }
}
