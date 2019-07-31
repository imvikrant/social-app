import React from 'react';

const AuthContext = React.createContext({
  loggedIn: false,
  logOut: () => {},
  logIn: () => {},
  username: ''
});

export default AuthContext;
