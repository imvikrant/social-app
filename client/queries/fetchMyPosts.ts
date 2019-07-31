import gql from 'graphql-tag';

const GET_MY_POSTS = gql`
  {
    posts {
      id
      description
      date
      imageUrl
      createdBy {
        username
        firstName
        lastName
      }
    }
  }
`;

export default GET_MY_POSTS;
