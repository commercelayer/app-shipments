import { getDisplayStatus } from '#data/status'
import {
  Badge,
  Spacer,
  Stack,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'

interface Props {
  shipment: Shipment
}

export const ShipmentSteps = withSkeletonTemplate<Props>(
  ({ shipment }): JSX.Element => {
    const displayStatus = getDisplayStatus(shipment)

    return (
      <Stack>
        <div>
          <Spacer bottom='2'>
            <Text size='small' tag='div' variant='info' weight='semibold'>
              Status
            </Text>
          </Spacer>
          {shipment.status !== undefined && (
            <Badge
              label={displayStatus.label.toUpperCase()}
              variant={displayStatus.badgeVariant}
            />
          )}
        </div>
        <div>
          <Spacer bottom='2'>
            <Text size='small' tag='div' variant='info' weight='semibold'>
              Shipping method
            </Text>
          </Spacer>
          {shipment.shipping_method?.name}
        </div>
      </Stack>
    )
  }
)
