import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Filters } from '#pages/Filters'
import { Home } from '#pages/Home'
import { Packing } from '#pages/Packing'
import { Purchase } from '#pages/Purchase'
import { ShipmentDetails } from '#pages/ShipmentDetails'
import { ShipmentList } from '#pages/ShipmentList'
import {
  CoreSdkProvider,
  ErrorBoundary,
  GTMProvider,
  MetaTags,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)
const basePath =
  import.meta.env.PUBLIC_PROJECT_PATH != null
    ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
    : undefined

export function App(): JSX.Element {
  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          kind='shipments'
          appSlug='shipments'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          devMode={isDev}
          loadingElement={<div />}
          organizationSlug={import.meta.env.PUBLIC_SELF_HOSTED_SLUG}
        >
          <GTMProvider gtmId={window.clAppConfig.gtmId}>
            <MetaTags />
            <CoreSdkProvider>
              <Router base={basePath}>
                <Switch>
                  <Route path={appRoutes.home.path}>
                    <Home />
                  </Route>
                  <Route path={appRoutes.filters.path}>
                    <Filters />
                  </Route>
                  <Route path={appRoutes.list.path}>
                    <ShipmentList />
                  </Route>
                  <Route path={appRoutes.details.path}>
                    <ShipmentDetails />
                  </Route>
                  <Route path={appRoutes.packing.path}>
                    <Packing />
                  </Route>
                  <Route path={appRoutes.purchase.path}>
                    <Purchase />
                  </Route>
                  <Route>
                    <ErrorNotFound />
                  </Route>
                </Switch>
              </Router>
            </CoreSdkProvider>
          </GTMProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
