import gql from 'graphql-tag';

const ACCEPT_REQUEST = gql`
  mutation acceptRequest($id: String) {
    acceptRequest(id: $id) {
      id
      username
    }
  }
`;

export default ACCEPT_REQUEST;
