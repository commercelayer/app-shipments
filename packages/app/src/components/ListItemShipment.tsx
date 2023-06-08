import { appRoutes } from '#data/routes'
import { getDisplayStatus } from '#data/status'
import { makeShipment } from '#mocks'
import {
  Icon,
  ListItem,
  Text,
  formatDate,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import { type Shipment } from '@commercelayer/sdk'
import { Link } from 'wouter'

export const ListItemShipment = withSkeletonTemplate<{ resource?: Shipment }>(
  ({ resource = makeShipment() }) => {
    const displayStatus = getDisplayStatus(resource)
    const { user } = useTokenProvider()

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
        >
          <div>
            <Text tag='div' weight='semibold'>
              {resource.number}
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
