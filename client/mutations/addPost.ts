import gql from 'graphql-tag';

const ADD_POST = gql`
  mutation AddPost ($description: String!, $image: Upload) {
    addPost(description: $description, image: $image) {
      id
      description
      date
    }
  }
`

export default ADD_POST;