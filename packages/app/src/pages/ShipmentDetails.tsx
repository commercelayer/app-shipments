import { ShipmentAddresses } from '#components/ShipmentAddresses'
import { ShipmentDetailsContextMenu } from '#components/ShipmentDetailsContextMenu'
import { ShipmentInfo } from '#components/ShipmentInfo'
import { ShipmentPackingList } from '#components/ShipmentPackingList'
import { ShipmentSteps } from '#components/ShipmentSteps'
import { ShipmentTimeline } from '#components/ShipmentTimeline'
import { appRoutes } from '#data/routes'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { useViewStatus } from '#hooks/useViewStatus'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  Text,
  formatDate,
  goBack,
  useTokenProvider
} from '@commercelayer/app-elements'
import isEmpty from 'lodash/isEmpty'
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
  const viewStatus = useViewStatus(shipment)

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
  const pageTitle = `${shipment.stock_location?.name} #${shipment.number}`

  return (
    <PageLayout
      mode={mode}
      actionButton={
        viewStatus.contextActions != null &&
        viewStatus.contextActions.length > 0 && (
          <ShipmentDetailsContextMenu
            shipment={shipment}
            actions={viewStatus.contextActions ?? []}
          />
        )
      }
      title={
        <SkeletonTemplate isLoading={isLoading}>{pageTitle}</SkeletonTemplate>
      }
      description={
        <SkeletonTemplate isLoading={isLoading}>
          <div>{`Updated on ${formatDate({
            isoDate: shipment.updated_at,
            timezone: user?.timezone,
            format: 'full'
          })}`}</div>
          {!isEmpty(shipment.reference) && (
            <div>
              <Text variant='info'>Ref. {shipment.reference}</Text>
            </div>
          )}
        </SkeletonTemplate>
      }
      onGoBack={() => {
        goBack({
          setLocation,
          defaultRelativePath: appRoutes.home.makePath()
        })
      }}
    >
      <SkeletonTemplate isLoading={isLoading}>
        <Spacer bottom='4'>
          <ShipmentSteps shipment={shipment} />
          <Spacer top='14'>
            <ShipmentInfo shipment={shipment} />
          </Spacer>
          <Spacer top='14'>
            <ShipmentPackingList shipment={shipment} />
          </Spacer>
          <Spacer top='14'>
            <ShipmentAddresses shipment={shipment} />
          </Spacer>
          <Spacer top='14'>
            <ShipmentTimeline shipment={shipment} />
          </Spacer>
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}
