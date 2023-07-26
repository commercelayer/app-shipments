import { appRoutes } from '#data/routes'
import { getDisplayStatus } from '#data/status'
import { makeShipment } from '#mocks'
import {
  Icon,
  ListItem,
  Text,
  formatDate,
  navigateToDetail,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import { type Shipment } from '@commercelayer/sdk'
import { Link, useLocation } from 'wouter'

export const ListItemShipment = withSkeletonTemplate<{ resource?: Shipment }>(
  ({ resource = makeShipment() }) => {
    const displayStatus = getDisplayStatus(resource)
    const { user } = useTokenProvider()
    const [, setLocation] = useLocation()

    const belongsToOrderWithMultipleShipments =
      (resource.order?.shipments ?? []).length > 1

    const orderNumber = belongsToOrderWithMultipleShipments
      ? resource.number
      : resource.number?.split('/')[0]

    return (
      <Link href={appRoutes.details.makePath(resource.id)}>
        <ListItem
          tag='a'
          icon={
            <Icon
              name={displayStatus.icon}
              gap='large'
              background={displayStatus.color}
            />
          }
          {...navigateToDetail({
            setLocation,
            destination: {
              app: 'shipments',
              resourceId: resource.id
            }
          })}
        >
          <div>
            <Text tag='div' weight='semibold'>
              {resource.order?.market?.name} #{orderNumber}
            </Text>
            <Text size='small' tag='div' variant='info' weight='medium'>
              {formatDate({
                format: 'date',
                isoDate: resource.updated_at,
                timezone: user?.timezone
              })}
              {' · '}
              <Text
                tag='span'
                weight='semibold'
                variant={
                  displayStatus.status === 'shipped' ? 'info' : 'warning'
                }
              >
                {displayStatus.label}
              </Text>
            </Text>
          </div>
          <Icon name='caretRight' />
        </ListItem>
      </Link>
    )
  }
)
