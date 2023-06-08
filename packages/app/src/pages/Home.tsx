import {
  PageLayout,
  Spacer,
  useTokenProvider
} from '@commercelayer/app-elements'

export function Home(): JSX.Element {
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
        Homepage
      </Spacer>
    </PageLayout>
  )
}
