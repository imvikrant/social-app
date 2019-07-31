import gql from 'graphql-tag';

const GET_USER_DETAILS = gql`
  {
    user {
      id
      firstName
      lastName
      age
      gender
    }
  }
`;

export default GET_USER_DETAILS;
