import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function PrivateRoute({ component: Component, ...rest }) {
  const { gjeldeneBruker } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return gjeldeneBruker ? <Component {...props} /> : <Redirect to="/Logginn" />
      }}
    ></Route>
  )
}
 
