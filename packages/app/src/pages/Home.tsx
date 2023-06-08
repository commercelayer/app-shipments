import { appRoutes } from '#data/routes'
import { makeShipment } from '#mocks'
import {
  Icon,
  ListItem,
  PageLayout,
  ResourceList,
  Spacer,
  Text,
  useCoreSdkProvider,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'
import { Link } from 'wouter'

export function Home(): JSX.Element {
  const { sdkClient } = useCoreSdkProvider()
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()

  return (
    <PageLayout
      title='Shipments'
      mode={mode}
      gap='only-top'
      onGoBack={() => {
        window.location.href =
          dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
      }}
    >
      <Spacer top='4' bottom='14'>
        <ResourceList
          sdkClient={sdkClient}
          type='shipments'
          emptyState={<div>Empty</div>}
          Item={ListItemShipment}
        />
      </Spacer>
    </PageLayout>
  )
}

const ListItemShipment = withSkeletonTemplate<{ resource?: Shipment }>(
  ({ resource = makeShipment() }) => (
    <Link href={appRoutes.details.makePath(resource.id)}>
      <ListItem
        tag='a'
        icon={<Icon name='arrowDown' gap='large' background='orange' />}
      >
        <div>
          <Text tag='div' weight='semibold'>
            {resource.number}
          </Text>
          <Text size='small' tag='div' variant='info' weight='medium'>
            {resource.created_at}
          </Text>
        </div>
        <Icon name='caretRight' />
      </ListItem>
    </Link>
  )
)
