import React, { useState } from 'react';
import { Query } from 'react-apollo';
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
  ListItemMeta
} from '@material/react-list';
import { Body1, Caption } from '@material/react-typography';
import Button from '@material/react-button';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import GET_FRIENDS_LIST from './../queries/fetchFriendsList';
import './Friends.scss';
import Search from './Search';
import Requests from './Requests';

const Friends = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <Grid className="friends-grid">
      <Row>
        <Cell columns={8} className="friends-grid-cell">
          <TabBar
            className="tab-bar"
            activeIndex={activeTabIndex}
            handleActiveIndexUpdate={index => setActiveTabIndex(index)}
          >
            <Tab className="tab">
              <span className="mdc-tab__text-label">Friends</span>
            </Tab>
            <Tab className="tab">
              <span className="mdc-tab__text-label">Requests</span>
            </Tab>
            <Tab className="tab">
              <span className="mdc-tab__text-label">Search</span>
            </Tab>
          </TabBar>
          <Query query={GET_FRIENDS_LIST}>
            {({ loading, error, data }: any) => {
              if (loading) return <h1>Loading...</h1>;
              if (error) return <h1>Error</h1>;
              console.log(data);
              if (activeTabIndex === 0)
                return (
                  <List>
                    {data.user.friendsList.map(friend => (
                      <ListItem className="friendList" key={friend.id}>
                        <ListItemGraphic
                          className="profilePic"
                          graphic={<img src={`/profileImage/${friend.id}`} />}
                        />
                        <ListItemText primaryText={friend.username} />
                        <ListItemMeta
                          meta={
                            <Button>
                              <Caption>Send Message</Caption>
                            </Button>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                );
              else if (activeTabIndex === 1) {
                return <Requests />;
              } else {
                return <Search />;
              }
            }}
          </Query>
        </Cell>
      </Row>
    </Grid>
  );
};

export default Friends;
