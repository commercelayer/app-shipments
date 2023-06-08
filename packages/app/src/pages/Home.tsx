import { ListItemShipment } from '#components/ListItemShipment'
import {
  PageLayout,
  ResourceList,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'

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
          query={{
            fields: {
              shipments: ['id', 'number', 'updated_at', 'status']
            },
            filters: {
              status_in: [
                'picking',
                'packing',
                'ready_to_ship',
                'on_hold',
                'shipped'
              ].join(',')
            }
          }}
        />
      </Spacer>
    </PageLayout>
  )
}
