import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import App from './components/App';

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/subscriptions`,
  options: {
    reconnect: true
  }
});

const cache = new InMemoryCache();

// cache.writeData({
//   data: {
//     profileImageUrl: `/profileImage/me?${new Date().getTime()}`,
//     coverImageUrl: `/coverImage/me?${new Date().getTime()}`
//   }
// });

// const httpLink = new HttpLink({ uri: '/graphql' });
const uploadLink = createUploadLink({ uri: '/graphql' });

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink
  // httpLink,
);

const client = new ApolloClient({
  cache,
  link,
  resolvers: {}
});

const Root = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.querySelector('#app'));
