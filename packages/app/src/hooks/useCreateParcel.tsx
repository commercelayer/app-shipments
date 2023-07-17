import { type PackingFormValues } from '#components/FormPacking'
import { useShipmentDetails } from '#hooks/useShipmentDetails'
import { useCoreSdkProvider } from '@commercelayer/app-elements'
import { useCallback, useState } from 'react'

interface CreateParcelHook {
  isMutating: boolean
  errors?: string[]
  trigger: (formValues: PackingFormValues) => Promise<void>
}

export function useCreateParcel(shipmentId: string): CreateParcelHook {
  const { mutateShipment } = useShipmentDetails(shipmentId)
  const { sdkClient } = useCoreSdkProvider()

  const [isMutating, setIsMutating] = useState(false)
  const [errors, setErrors] = useState<string[] | undefined>()

  const trigger: CreateParcelHook['trigger'] = useCallback(
    async (formValues) => {
      setIsMutating(true)
      setErrors(undefined)

      try {
        const parcel = await sdkClient.parcels.create({
          weight: parseInt(formValues.weight, 10),
          unit_of_weight: formValues.unitOfWeight,
          package: sdkClient.packages.relationship(formValues.packageId),
          shipment: sdkClient.shipments.relationship(shipmentId)
        })
        await Promise.all(
          formValues.items.map(
            async (item) =>
              await sdkClient.parcel_line_items.create({
                quantity: item.quantity,
                stock_line_item: sdkClient.stock_line_items.relationship(
                  item.value
                ),
                parcel: sdkClient.parcels.relationship(parcel.id)
              })
          )
        )
      } catch {
        // TODO: should we delete parcel if empty?
      } finally {
        await mutateShipment()
        setIsMutating(false)
      }
    },
    [shipmentId]
  )

  return {
    isMutating,
    errors,
    trigger
  }
}
