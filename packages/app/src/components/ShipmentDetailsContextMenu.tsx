import { useTriggerAttribute } from '#hooks/useTriggerAttribute'
import type { Action } from '#hooks/useViewStatus'
import { Dropdown, DropdownItem } from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'

export const ShipmentDetailsContextMenu: React.FC<{
  shipment: Shipment
  actions: Action[]
}> = ({ shipment, actions }) => {
  const { trigger } = useTriggerAttribute(shipment.id)

  return (
    <Dropdown
      dropdownItems={actions.map((action) => (
        <DropdownItem
          key={action.label}
          label={action.label}
          onClick={() => {
            if (action.triggerAttribute === '_create_parcel') {
              return
            }

            void trigger(action.triggerAttribute)
          }}
        />
      ))}
    />
  )
}
