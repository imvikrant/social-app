import gql from 'graphql-tag';

const GET_FRIENDS_LIST = gql`
  {
    user {
      id
      friendsList {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

export default GET_FRIENDS_LIST;
