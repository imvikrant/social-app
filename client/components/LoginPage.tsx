import React from 'react';
import TabBar, { Tab } from '@material/react-tab-bar';
import Card from '@material/react-card';
import Button from '@material/react-button';
import Login from './Login';
import Register from './Register';
import './LoginPage.scss';
import AuthContext from '../contexts/AuthContext';
import { Redirect } from 'react-router';

class LoginPage extends React.Component {
  state = {
    activeIndex: 0
  };

  renderAuthForm(index: number): JSX.Element {
    return index === 0 ? <Login /> : <Register />;
  }

  render() {
    return (
      <>
        <AuthContext.Consumer>
          {({ loggedIn, username }) =>
            loggedIn && <Redirect to={`/app/home`} />
          }
        </AuthContext.Consumer>
        <Card outlined className="auth-form-wrapper">
          <TabBar
            activeIndex={this.state.activeIndex}
            handleActiveIndexUpdate={index =>
              this.setState({ activeIndex: index })
            }
          >
            <Tab>
              <span className="mdc-tab__text-label">Login</span>
            </Tab>
            <Tab>
              <span className="mdc-tab__text-label">Register</span>
            </Tab>
          </TabBar>
          <div className="auth-form">
            {this.renderAuthForm(this.state.activeIndex)}
          </div>
        </Card>
      </>
    );
  }
}

export default LoginPage;
