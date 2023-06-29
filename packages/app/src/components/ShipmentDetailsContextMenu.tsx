import { ContextMenu, DropdownMenuItem } from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'

export const ShipmentDetailsContextMenu: React.FC<{
  shipment: Shipment
  actions: string[]
}> = ({ actions }) => {
  return (
    <ContextMenu
      menuItems={actions.map((triggerAttribute) => (
        <DropdownMenuItem
          key={triggerAttribute}
          label={triggerAttribute}
          onClick={() => {
            alert(triggerAttribute)
          }}
        />
      ))}
    />
  )
}
