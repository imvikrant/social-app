import React from 'react';
import { Query } from 'react-apollo';
import List, {
  ListItem,
  ListItemGraphic,
  ListItemText,
  ListItemMeta
} from '@material/react-list';
import { Caption } from '@material/react-typography';
import Button from '@material/react-button';
import gql from 'graphql-tag';
import GET_REQUESTS from './../queries/fetchRequests';
import RequestList from './RequestList';

const SUBSCRIPTION = gql`
  subscription newRequest($id: String!) {
    newRequest(id: $id) {
      id
      firstName
      lastName
      username
    }
  }
`;

function Requests() {
  return (
    <Query query={GET_REQUESTS}>
      {({ loading, error, data, subscribeToMore }: any) => {
        if (loading) return 'loading...';
        if (error) return 'error...';

        console.log('REQ', data);

        return (
          <RequestList
            data={data}
            subscribeToRequests={() =>
              subscribeToMore({
                document: SUBSCRIPTION,
                variables: { id: localStorage.getItem('social-app-id') },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const user = subscriptionData.data.newRequest;
                  console.log('subscription data', subscriptionData);
                  console.log('pre', prev);

                  return Object.assign({}, prev, {
                    user: {
                      ...prev.user,
                      requests: prev.user.requests.concat(
                        subscriptionData.data.newRequest
                      )
                    }
                  });
                }
              })
            }
          />
        );
      }}
    </Query>
  );
}

export default Requests;
