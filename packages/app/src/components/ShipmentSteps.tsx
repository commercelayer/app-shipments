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
            <Badge variant={displayStatus.badgeVariant}>
              {displayStatus.label.toUpperCase()}
            </Badge>
          )}
        </div>
        <div>
          <Spacer bottom='2'>
            <Text size='small' tag='div' variant='info' weight='semibold'>
              Origin
            </Text>
          </Spacer>
          <Text weight='semibold' className='text-[18px]'>
            {shipment.stock_location?.name}
          </Text>
        </div>
      </Stack>
    )
  }
)
