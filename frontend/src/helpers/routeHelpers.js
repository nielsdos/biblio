import React from 'react';
import {Route, Redirect} from "react-router-dom";

/**
 * Creates a new guarded route.
 * This is a route that can only be accessed when a condition is true.
 * Redirects if the condition is false.
 *
 * @param {string} redirectPath Redirect path
 * @return {function} A function that creates a GuardedRoute
 */
function guardedRoute(redirectPath) {
  /**
   * The route function.
   *
   * @param {object} props  The props
   * @return {React.component} The route component that guards access
   */
  return function({ component, render, location, guard, ...rest }) {
    return (
      <Route
        {...rest}
        render={props => {
          return guard ? (
            component !== undefined ? (
              React.createElement(component, props)
            ) : (
              render(props)
            )
          ) : (
            <Redirect
              to={{
                pathname: redirectPath,
                state: {
                  previousPath: location.pathname,
                },
              }}
            />
          );
        }}
      />
    );
  };
}

export const LoginRedirectedRoute = guardedRoute('/login');
export const HomeRedirectedRoute = guardedRoute('/');
