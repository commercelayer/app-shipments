import { FormPacking } from '#components/FormPacking'
import { ShipmentProgress } from '#components/ShipmentProgress'
import { appRoutes } from '#data/routes'
import { useCreateParcel } from '#hooks/useCreateParcel'
import { usePickingList } from '#hooks/usePickingList'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { isMock } from '#mocks'
import {
  Button,
  EmptyState,
  PageLayout,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'
import { isEmpty, uniq } from 'lodash'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function Packing(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const [, params] = useRoute<{ shipmentId: string }>(appRoutes.packing.path)
  const shipmentId = params?.shipmentId ?? ''
  const [, setLocation] = useLocation()
  const { shipment, isLoading } = useShipmentDetails(shipmentId)
  const pickingList = usePickingList(shipment)
  const isValidStatus = shipment?.status === 'packing'
  const { createParcelError, createParcelWithItems, isCreatingParcel } =
    useCreateParcel(shipmentId)

  const defaultWeight = useMemo<string>(() => {
    let totalWeight = 0

    for (const item of shipment.stock_line_items ?? []) {
      if (
        item.stock_item?.sku?.weight == null ||
        item.stock_item?.sku?.weight <= 0
      ) {
        totalWeight = 0
        break
      }

      totalWeight += item.stock_item.sku.weight * item.quantity
    }

    return totalWeight > 0 ? totalWeight.toString() : ''
  }, [shipment])

  const defaultUnitOfWeight = useMemo(
    () =>
      uniq(
        shipment.stock_line_items
          ?.map((item) => item.stock_item?.sku?.unit_of_weight)
          .filter((item) => !isEmpty(item))
      )[0] ?? 'gr',
    [shipment]
  )

  useEffect(() => {
    if (pickingList.length === 0 && !isMock(shipment)) {
      setLocation(appRoutes.details.makePath(shipmentId))
    }
  }, [pickingList])

  if (isMock(shipment) || isLoading) {
    return <div />
  }

  if (
    shipmentId == null ||
    !canUser('create', 'parcels') ||
    !isValidStatus ||
    shipment.stock_location?.id == null
  ) {
    return (
      <PageLayout
        title='Shipments'
        onGoBack={() => {
          setLocation(appRoutes.home.makePath())
        }}
        mode={mode}
      >
        <EmptyState
          title={
            !isValidStatus
              ? 'This shipment is not in packing status'
              : shipment.stock_location?.id == null
              ? 'Missing stock_location'
              : 'Not authorized'
          }
          action={
            <Link
              href={
                shipmentId == null
                  ? appRoutes.home.makePath()
                  : appRoutes.details.makePath(shipmentId)
              }
            >
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title='Packing'
      onGoBack={() => {
        setLocation(appRoutes.details.makePath(shipmentId))
      }}
      mode={mode}
      gap='only-top'
    >
      <Spacer bottom='12' top='6'>
        <ShipmentProgress shipment={shipment} />
      </Spacer>
      <Spacer bottom='12'>
        <FormPacking
          defaultValues={{
            items: pickingList.map((item) => ({
              quantity: item.quantity,
              value: item.id
            })),
            packageId: '',
            weight: defaultWeight,
            unitOfWeight: defaultUnitOfWeight
          }}
          stockLineItems={pickingList}
          stockLocationId={shipment.stock_location.id}
          isSubmitting={isCreatingParcel}
          apiError={createParcelError}
          onSubmit={(formValues) => {
            void createParcelWithItems(formValues)
          }}
        />
      </Spacer>
    </PageLayout>
  )
}
