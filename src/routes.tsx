import { Switch, Route, RouteProps, Redirect } from "react-router-dom"
import { Dictionary } from "ramda"

import Dashboard from "./pages/Dashboard"

export enum MenuKey {
  DASHBOARD = "Dashboard",
}

export const menu: Dictionary<RouteProps> = {
  // Not included in navigation bar
  [MenuKey.DASHBOARD]: { path: "/", exact: true, component: Dashboard },
}

export const getPath = (key: MenuKey) => menu[key]?.path as string

export default (routes: Dictionary<RouteProps> = menu, path: string = "") => (
  <Switch>
    {Object.entries(routes).map(([key, route]) => (
      <Route {...route} path={path + route.path} key={key} />
    ))}

    <Redirect to="/" />
  </Switch>
)
