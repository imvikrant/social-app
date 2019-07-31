import gql from 'graphql-tag';

const SEND_REQUEST = gql`
  mutation newRequest ($id: String) {
    newRequest(id: $id) {
      id
    }
  }
`

export default SEND_REQUEST;