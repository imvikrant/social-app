import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import AuthContext from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <AuthContext.Consumer>
        {({ loggedIn }) => {
          if (loggedIn) return <Component {...props} />;
          else
            return (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: props.location }
                }}
              />
            );
        }}
      </AuthContext.Consumer>
    )}
  />
);

export default PrivateRoute;
