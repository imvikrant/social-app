import React from 'react';
import Home from './Home';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar';
import AppBar from './AppBar';
import MaterialIcon from '@material/react-material-icon';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import './App.scss';
import Friends from './Friends';
import LoginPage from './LoginPage';
import Register from './Register';
import PrivateRoute from './../helpers/PrivateRoute';
import AuthContext from '../contexts/AuthContext';
import ProfilePage from './ProfilePage';

const MainApp = ({ match }) => (
  <>
    <AppBar />
    <TopAppBarFixedAdjust dense className="app-content">
      <Route path={`${match.path}/home`} component={Home} />
      <Route path={`${match.path}/friends`} component={Friends} />
      <Route path={`${match.path}/profile`} component={ProfilePage} />
    </TopAppBarFixedAdjust>
  </>
);

class App extends React.Component {
  state = {
    loggedIn: false,
    username: 'app'
  };

  logIn = () => {
    this.setState({ loggedIn: true });
  };

  logOut = () => {
    this.setState({ loggedIn: false });
  };

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus = () => {
    fetch('/login')
      .then(res => res.json())
      .then(jsonRes => {
        if (jsonRes.auth)
          this.setState({ loggedIn: true, username: jsonRes.username });
      });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          loggedIn: this.state.loggedIn,
          logOut: this.logOut,
          logIn: this.logIn,
          username: this.state.username
        }}
      >
        <Router>
          <div>
            <Route path="/" exact component={LoginPage} />
            <PrivateRoute path={`/app`} component={MainApp} />
          </div>
        </Router>
      </AuthContext.Provider>
    );
  }
}

export default App;
