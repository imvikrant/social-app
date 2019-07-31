import React, { Component } from 'react';
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
  ListItemMeta
} from '@material/react-list';
import Button from '@material/react-button';
import { Caption } from '@material/react-typography';
import { Mutation } from 'react-apollo';
import ACCEPT_REQUEST from './../mutations/acceptRequest';
import GET_FRIENDS_LIST from '../queries/fetchFriendsList';
import GET_REQUESTS from './../queries/fetchRequests';

interface IProps {
  data: any;
  subscribeToRequests: Function;
}

interface IState {}

export default class RequestList extends Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.subscribeToRequests();
  }

  render() {
    return (
      <Mutation
        mutation={ACCEPT_REQUEST}
        update={(cache, { data: { acceptRequest } }: any) => {
          console.log('start...');
          const { user } = cache.readQuery({ query: GET_FRIENDS_LIST });
          const { user: user2 } = cache.readQuery({ query: GET_REQUESTS });
          console.log('user', user);
          console.log('user2', user2);
          cache.writeQuery({
            query: GET_FRIENDS_LIST,
            data: {
              user: {
                ...user,
                friendsList: [...user.friendsList, acceptRequest]
              }
            }
          });
          console.log('1done');
          cache.writeQuery({
            query: GET_REQUESTS,
            data: {
              user: {
                ...user2,
                requests: user2.requests.filter(
                  ({ id }) => id !== acceptRequest.id
                )
              }
            }
          });
          console.log('2done');
        }}
      >
        {(acceptRequest, data) => (
          <List>
            {this.props.data.user.requests.map(u => (
              <ListItem key={Math.random()} className="friendList">
                <ListItemGraphic
                  className="profilePic"
                  graphic={<img src={`/profileImage/${u.id}`} />}
                />
                <ListItemText primaryText={`${u.firstName} ${u.lastName}`} />
                <ListItemMeta
                  meta={
                    <Button
                      onClick={() => acceptRequest({ variables: { id: u.id } })}
                    >
                      <Caption>Accept Request</Caption>
                    </Button>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Mutation>
    );
  }
}
