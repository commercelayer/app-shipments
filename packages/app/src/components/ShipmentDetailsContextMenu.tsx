import { useTriggerAttribute } from '#hooks/useTriggerAttribute'
import { useViewStatus } from '#hooks/useViewStatus'
import { isMockedId } from '#mocks'
import {
  Button,
  Dropdown,
  DropdownItem,
  Icon,
  useEditMetadataOverlay
} from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'

export const ShipmentDetailsContextMenu: React.FC<{
  shipment: Shipment
}> = ({ shipment }) => {
  const { trigger } = useTriggerAttribute(shipment.id)
  const viewStatus = useViewStatus(shipment)

  const { Overlay: EditMetadataOverlay, show: showEditMetadataOverlay } =
    useEditMetadataOverlay()

  const dropdownItems =
    viewStatus.contextActions?.map((action) => (
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
    )) ?? []
  dropdownItems.push(
    <DropdownItem
      label='Metadata'
      onClick={() => {
        showEditMetadataOverlay()
      }}
    />
  )

  return (
    <>
      {!isMockedId(shipment.id) && (
        <EditMetadataOverlay
          resourceType={shipment.type}
          resourceId={shipment.id}
          title='Edit metadata'
          description={`Shipment #${shipment.number}`}
        />
      )}
      <Dropdown
        dropdownLabel={
          <Button variant='secondary' size='small'>
            <Icon name='dotsThree' weight='bold' size={16} />
          </Button>
        }
        dropdownItems={dropdownItems}
      />
    </>
  )
}
