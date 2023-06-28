import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Filters } from '#pages/Filters'
import { Home } from '#pages/Home'
import { ShipmentDetails } from '#pages/ShipmentDetails'
import { ShipmentList } from '#pages/ShipmentList'
import {
  CoreSdkProvider,
  ErrorBoundary,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)

export function App(): JSX.Element {
  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          kind='webapp'
          appSlug='shipments'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          devMode={isDev}
          loadingElement={<div />}
        >
          <CoreSdkProvider>
            <Router base='/shipments'>
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
                <Route>
                  <ErrorNotFound />
                </Route>
              </Switch>
            </Router>
          </CoreSdkProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
