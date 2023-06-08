import { appRoutes } from '#data/routes'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  formatDate,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useShipmentDetails } from 'src/hooks/useShipmentDetails'
import { Link, useLocation, useRoute } from 'wouter'

export function ShipmentDetails(): JSX.Element {
  const {
    canUser,
    settings: { mode },
    user
  } = useTokenProvider()
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ shipmentId: string }>(appRoutes.details.path)

  const shipmentId = params?.shipmentId ?? ''

  const { shipment, isLoading } = useShipmentDetails(shipmentId)

  if (shipmentId === undefined || !canUser('read', 'orders')) {
    return (
      <PageLayout
        title='Orders'
        onGoBack={() => {
          setLocation(appRoutes.home.makePath())
        }}
        mode={mode}
      >
        <EmptyState
          title='Not authorized'
          action={
            <Link href={appRoutes.home.makePath()}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const pageTitle = `${shipment.number}`

  return (
    <PageLayout
      mode={mode}
      title={
        <SkeletonTemplate isLoading={isLoading}>{pageTitle}</SkeletonTemplate>
      }
      description={
        <SkeletonTemplate isLoading={isLoading}>{`Placed on ${formatDate({
          isoDate: shipment.created_at ?? '',
          timezone: user?.timezone,
          format: 'full'
        })}`}</SkeletonTemplate>
      }
      onGoBack={() => {
        setLocation(appRoutes.home.makePath())
      }}
    >
      <SkeletonTemplate isLoading={isLoading}>
        <Spacer bottom='4'>{shipment.number}</Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}
