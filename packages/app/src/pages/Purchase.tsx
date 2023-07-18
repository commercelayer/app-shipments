import { appRoutes } from '#data/routes'
import {
  shipmentIncludeAttribute,
  useShipmentDetails,
  useShipmentRates
} from '#hooks/useShipmentDetails'
import { makeShipment } from '#mocks'
import {
  Avatar,
  Button,
  EmptyState,
  InputRadioGroup,
  ListItem,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  Text,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function Purchase(): JSX.Element | null {
  const [, params] = useRoute<{ shipmentId: string }>(appRoutes.purchase.path)
  const shipmentId = params?.shipmentId ?? ''

  const { shipment, isLoading } = useShipmentDetails(shipmentId)
  const hasBeenPurchased = shipment.purchase_started_at != null

  if (isLoading) {
    return null
  }

  if (hasBeenPurchased) {
    return <NotAuthorized shipmentId={shipmentId} />
  }

  return <PurchaseShipment shipmentId={shipmentId} />
}

function PurchaseShipment({ shipmentId }: { shipmentId: string }): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()
  const [selectedRateId, setSelectedRateId] = useState<string | undefined>()

  const { isRefreshing } = useShipmentRates(shipmentId)
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
  const {
    shipment: fetchedShipment,
    mutateShipment,
    isLoading
  } = useShipmentDetails(shipmentId, isRefreshing, false)

  const isReady = useMemo(
    () => !(isRefreshing || isLoading || isWaiting),
    [isRefreshing, isLoading, isWaiting]
  )

  const shipment = useMemo(
    () => (isReady ? fetchedShipment : makeShipment()),
    [isReady, fetchedShipment]
  )

  const selectedRate = useMemo(() => {
    return shipment.rates?.find((rate) => rate.id === selectedRateId)
  }, [selectedRateId, shipment.rates])

  useEffect(
    function refreshRates() {
      if (!isRefreshing) {
        setTimeout(() => {
          setIsWaiting(false)
          void mutateShipment()
        }, 5000)
      }
    },
    [isRefreshing]
  )

  const options = useMemo(() => {
    return (
      shipment.rates?.map((rate) => ({
        value: rate.id,
        content: (
          <ListItem
            tag='div'
            alignItems='top'
            alignIcon='center'
            padding='none'
            borderStyle='none'
            icon={
              <Avatar
                src='carriers:generic'
                alt={rate.carrier}
                border='none'
                shape='circle'
                size='small'
              />
            }
          >
            <div>
              <Text size='regular' weight='bold'>
                {rate.service}
              </Text>
              {rate.carrier != null && (
                <Text size='small' tag='div' variant='info' weight='medium'>
                  {rate.carrier}
                </Text>
              )}
            </div>
            <Text size='regular' weight='bold'>
              {rate.formatted_rate}
            </Text>
          </ListItem>
        )
      })) ?? []
    )
  }, [shipment.rates])

  if (shipmentId === undefined || !canUser('read', 'orders')) {
    return <NotAuthorized shipmentId={shipmentId} />
  }

  return (
    <PageLayout
      mode={mode}
      title='Select a shipping rate'
      onGoBack={() => {
        setLocation(appRoutes.details.makePath(shipmentId))
      }}
    >
      <SkeletonTemplate isLoading={!isReady}>
        <Spacer bottom='4'>
          <InputRadioGroup
            name='carrier'
            options={options}
            onChange={(rateId) => {
              setSelectedRateId(rateId)
            }}
          />
        </Spacer>
        <Spacer bottom='4'>
          <SkeletonTemplate isLoading={false}>
            <Button
              fullWidth
              disabled={selectedRate == null}
              onClick={() => {
                if (selectedRate != null) {
                  void sdkClient.shipments
                    .update(
                      {
                        id: shipment.id,
                        _purchase: true,
                        selected_rate_id: selectedRate.id
                      },
                      { include: shipmentIncludeAttribute }
                    )
                    .then(async () => {
                      setLocation(appRoutes.details.makePath(shipmentId))
                    })
                }
              }}
            >
              Pay {selectedRate?.formatted_rate}
            </Button>
          </SkeletonTemplate>
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}

function NotAuthorized({ shipmentId }: { shipmentId: string }): JSX.Element {
  const {
    settings: { mode }
  } = useTokenProvider()
  const [, setLocation] = useLocation()
  return (
    <PageLayout
      title='Select a shipping rate'
      onGoBack={() => {
        setLocation(appRoutes.home.makePath())
      }}
      mode={mode}
    >
      <EmptyState
        title='Not authorized'
        action={
          <Link href={appRoutes.details.makePath(shipmentId)}>
            <Button variant='primary'>Go back</Button>
          </Link>
        }
      />
    </PageLayout>
  )
}
