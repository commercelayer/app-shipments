import { Grid, InputFeedback, useCoreApi } from '@commercelayer/app-elements'
import { ToggleButtons } from '@commercelayer/app-elements-hook-form'

interface Props {
  /**
   * Will be used retrieve the available packages
   */
  stockLocationId: string
}

export function FormFieldPackages({ stockLocationId }: Props): JSX.Element {
  // TODO: when initial packages are more than 4, add a select
  const { data: packages, isLoading } = useCoreApi('packages', 'list', [
    {
      filters: {
        stock_location_id_eq: stockLocationId
      },
      pageSize: 4
    }
  ])

  if (packages == null || isLoading) {
    return <></>
  }

  if (packages.length === 0) {
    return (
      <InputFeedback message='No packages found for current stock location' />
    )
  }

  return (
    <Grid columns='2'>
      <ToggleButtons
        name='packageId'
        label='Package'
        options={packages.map((p) => ({
          value: p.id,
          label: p.name
        }))}
        mode='single'
      />
    </Grid>
  )
}
