import {
  A,
  Legend,
  Spacer,
  Stack,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Address, Shipment } from '@commercelayer/sdk'
import { Link } from 'wouter'

interface Props {
  shipment: Shipment
}

function renderAddress({
  label,
  address,
  editUrl,
  isSameAsBilling,
  showBillingInfo
}: {
  label: string
  address: Address | undefined | null
  editUrl?: string
  isSameAsBilling?: boolean
  showBillingInfo?: boolean
}): JSX.Element | null {
  if (isSameAsBilling === true) {
    return (
      <div>
        <Spacer bottom='2'>
          <Text tag='div' weight='bold'>
            {label}
          </Text>
        </Spacer>
        <Text tag='div' variant='info'>
          Same as billing
        </Text>
      </div>
    )
  }

  if (address == null) {
    return null
  }

  return (
    <div>
      <Spacer bottom='2'>
        <Text tag='div' weight='bold'>
          {label}
        </Text>
      </Spacer>
      <Spacer bottom='4'>
        <Text tag='div' variant='info'>
          {address.full_name}
          <br />
          {address.line_1} {address.line_2}
          <br />
          {address.city} {address.state_code} {address.zip_code} (
          {address.country_code})
        </Text>
        {address.billing_info != null && showBillingInfo === true ? (
          <Text tag='div' variant='info'>
            {address.billing_info}
          </Text>
        ) : null}
      </Spacer>
      {editUrl != null ? (
        <Link href={editUrl}>
          <A>Edit</A>
        </Link>
      ) : null}
    </div>
  )
}

export const ShipmentAddresses = withSkeletonTemplate<Props>(
  ({ shipment }): JSX.Element | null => {
    if (shipment.shipping_address == null && shipment.origin_address == null) {
      return null
    }

    return (
      <>
        <Legend border='none' title='Addresses' />
        <Stack>
          {renderAddress({
            label: 'Ship from',
            address: shipment.origin_address
          })}
          {renderAddress({
            label: 'Ship to',
            address: shipment.shipping_address
          })}
        </Stack>
      </>
    )
  }
)
