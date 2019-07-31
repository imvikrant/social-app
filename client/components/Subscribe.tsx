import React from 'react'
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo'

const SUBSCRIPTION = gql`
  subscription postAdded {
    postAdded {
      id
      description
    }
  }
`;

const Hello = () => (
  <div>
    <h1>Hi</h1>
    <Subscription
    subscription={SUBSCRIPTION}
  >
    {({ data, loading }) => {
      if (loading)
        return 'LOADING'
      console.log(data)
      return <h1>{data.postAdded.description}</h1>
    }}
  </Subscription>
  </div>
  
);

export default Hello;