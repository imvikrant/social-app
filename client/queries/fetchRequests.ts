import gql from 'graphql-tag';

const GET_REQUESTS = gql`
  {
    user {
      id
      requests {
        id
        firstName
        lastName
        username
      }
    }
  }
`;

export default GET_REQUESTS;
