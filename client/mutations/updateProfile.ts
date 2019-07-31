import gql from 'graphql-tag';

const UPDATE_PROFILE = gql`
  mutation updateUser(
    $firstName: String
    $lastName: String
    $age: String
    $gender: String
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      age: $age
      gender: $gender
    ) {
      id
      firstName
      lastName
      gender
      age
    }
  }
`;

export default UPDATE_PROFILE;
