import { type PackingFormValues } from '#components/FormPacking'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { useCoreSdkProvider } from '@commercelayer/app-elements'
import type {
  CommerceLayerClient,
  Parcel,
  ParcelLineItem
} from '@commercelayer/sdk'
import { useCallback, useState } from 'react'

interface CreateParcelHook {
  isCreatingParcel: boolean
  createParcelError?: any
  createParcelWithItems: (formValues: PackingFormValues) => Promise<void>
}

export function useCreateParcel(shipmentId: string): CreateParcelHook {
  const { mutateShipment } = useShipmentDetails(shipmentId)
  const { sdkClient } = useCoreSdkProvider()

  const [isCreatingParcel, setIsCreatingParcel] = useState(false)
  const [createParcelError, setCreateParcelError] =
    useState<CreateParcelHook['createParcelError']>()

  const createParcelWithItems: CreateParcelHook['createParcelWithItems'] =
    useCallback(
      async (formValues) => {
        setIsCreatingParcel(true)
        setCreateParcelError(undefined)
        let parcel: Parcel | undefined
        const parcelLineItems: ParcelLineItem[] = []

        try {
          parcel = await sdkClient.parcels.create({
            weight: parseInt(formValues.weight, 10),
            unit_of_weight: formValues.unitOfWeight,
            package: sdkClient.packages.relationship(formValues.packageId),
            shipment: sdkClient.shipments.relationship(shipmentId)
          })

          await Promise.all(
            formValues.items.map(
              async (item) =>
                await sdkClient.parcel_line_items
                  .create({
                    quantity: item.quantity,
                    stock_line_item: sdkClient.stock_line_items.relationship(
                      item.value
                    ),
                    parcel: sdkClient.parcels.relationship(parcel?.id ?? '')
                  })
                  .then((lineItem) => parcelLineItems.push(lineItem))
            )
          )

          await mutateShipment()
        } catch (err) {
          // delete line items and parcel if they were partially created
          if (parcel?.id != null && parcelLineItems?.length > 0) {
            await deleteParcelLineItems(parcelLineItems, sdkClient)
            await sdkClient.parcels.delete(parcel.id)
          }
          setCreateParcelError(err)
        } finally {
          setIsCreatingParcel(false)
        }
      },
      [shipmentId]
    )

  return {
    isCreatingParcel,
    createParcelError,
    createParcelWithItems
  }
}

async function deleteParcelLineItems(
  lineItems: ParcelLineItem[],
  sdkClient: CommerceLayerClient
): Promise<void> {
  await Promise.all(
    lineItems.map(async (item) => {
      await sdkClient.parcel_line_items.delete(item.id)
    })
  )
}
