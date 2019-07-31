import gql from 'graphql-tag';

const GET_USER = gql`
  {
    user {
      id
      username
      firstName
      lastName
      posts {
        description
      }
    }
  }
`;

export default GET_USER;
