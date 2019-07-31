import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {withApollo} from 'react-apollo'

import TopAppBar, {
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from '@material/react-top-app-bar';
import { Body1 } from '@material/react-typography';
import './AppBar.scss'

import {Link} from 'react-router-dom'
import TabBar, { Tab } from '@material/react-tab-bar';
import Button from '@material/react-button';
import AuthContext from '../contexts/AuthContext';

const handleLogOut = (logOut: () => void) => {
  fetch('/logout').then((res) => {
    return res.text()
  }).then(text => {logOut();console.log(text)})
}

const AppBar = ({client} : any) => {

  

  const [nav, setNav] = useState(['home', 'profile', 'friends'])
  const [activeTabIndex, setActiveTabIndex] = useState(0);


  return (
    <>
    <AuthContext.Consumer>{({loggedIn}) => { console.log('logged',loggedIn);return loggedIn ? null : <Redirect to="/" /> }}</AuthContext.Consumer>
    <Redirect to={nav[activeTabIndex]} />
    <TopAppBar dense className="top-app-bar">
  
        <TopAppBarRow className="app-bar-container">
          <TopAppBarSection align="start">
            <TopAppBarTitle>PenPal</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection align='end'>

            <TabBar className="home-tab-bar" activeIndex={activeTabIndex} handleActiveIndexUpdate={(index) =>{
              console.log('index')
              setActiveTabIndex(index)
            }
            }>
              <Tab className="home-tab"><span className='mdc-tab__text-label'>Home</span></Tab>
              <Tab className="home-tab"><span className='mdc-tab__text-label'>Profile</span></Tab>
              <Tab className="home-tab"><span className='mdc-tab__text-label'>Friends</span></Tab>
            </TabBar>
            {/* <TopAppBarIcon navIcon tabIndex={0} className="nav-link">
              <Link to="/"><Body1>Home</Body1></Link>
            </TopAppBarIcon>
            <TopAppBarIcon navIcon tabIndex={0} className="nav-link">
              <Link to="/profile"><Body1>Profile</Body1></Link>
            </TopAppBarIcon>
            <TopAppBarIcon navIcon tabIndex={0} className="nav-link">
              <Link to="/friends"><Body1>Friends</Body1></Link>
            </TopAppBarIcon> */}
            <AuthContext.Consumer>
              {({logOut}) => (
                <Button onClick={() => {
                  console.log('logged out')
                  client.cache.reset();
                  handleLogOut(logOut);
                }}>LogOut</Button>
              )}
            </AuthContext.Consumer>
            
          </TopAppBarSection>
        </TopAppBarRow>
        
      </TopAppBar>
      </>
  )
}

export default withApollo(AppBar)


