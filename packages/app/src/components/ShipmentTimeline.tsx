import {
  Legend,
  Spacer,
  Timeline,
  useCoreSdkProvider,
  useTokenProvider,
  withSkeletonTemplate,
  type TimelineEvent
} from '@commercelayer/app-elements'
import type { Shipment } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useReducer, type Reducer } from 'react'
import { useShipmentDetails } from 'src/hooks/useShipmentDetails'

interface Props {
  shipment: Shipment
}

interface TimelineReducerAction {
  type: 'add'
  payload: TimelineEvent
}

const timelineReducer: Reducer<TimelineEvent[], TimelineReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'add':
      if (state.find((s) => s.date === action.payload.date) != null) {
        return state
      }

      return [...state, action.payload]
    default:
      return state
  }
}

const useTimelineReducer = (
  shipment: Shipment
): [TimelineEvent[], React.Dispatch<TimelineReducerAction>] => {
  const [events, dispatch] = useReducer(timelineReducer, [])

  useEffect(
    function addCreated() {
      if (shipment.created_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: shipment.created_at,
            message: 'Created'
          }
        })
      }
    },
    [shipment.created_at]
  )

  useEffect(
    function addPlaced() {
      if (shipment.order?.placed_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: shipment.order?.placed_at,
            message: 'Order placed'
          }
        })
      }
    },
    [shipment.order?.placed_at]
  )

  useEffect(
    function addCancelled() {
      if (shipment.order?.cancelled_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: shipment.order?.cancelled_at,
            message: 'Order cancelled'
          }
        })
      }
    },
    [shipment.order?.cancelled_at]
  )

  useEffect(
    function addApproved() {
      if (shipment.order?.approved_at != null) {
        dispatch({
          type: 'add',
          payload: {
            date: shipment.order?.approved_at,
            message: 'Order approved'
          }
        })
      }
    },
    [shipment.order?.approved_at]
  )

  return [events, dispatch]
}

export const ShipmentTimeline = withSkeletonTemplate<Props>(({ shipment }) => {
  const [events] = useTimelineReducer(shipment)
  const { sdkClient } = useCoreSdkProvider()
  const { user } = useTokenProvider()
  const { mutateShipment } = useShipmentDetails(shipment.id)

  return (
    <>
      <Legend title='Timeline' />
      <Spacer top='8'>
        <Timeline
          events={events}
          timezone={user?.timezone}
          onKeyDown={(event) => {
            if (event.code === 'Enter' && event.currentTarget.value !== '') {
              if (user?.displayName != null && !isEmpty(user.displayName)) {
                void sdkClient.attachments
                  .create({
                    reference_origin: 'app-shipments--note',
                    name: user.displayName,
                    description: event.currentTarget.value,
                    attachable: { type: 'shipments', id: shipment.id }
                  })
                  .then(() => {
                    void mutateShipment()
                  })
              } else {
                console.warn(
                  `Cannot create the attachment: token does not contain a valid "user".`
                )
              }

              event.currentTarget.value = ''
            }
          }}
        />
      </Spacer>
    </>
  )
})
