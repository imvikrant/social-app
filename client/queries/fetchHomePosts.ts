import gql from 'graphql-tag';

const GET_HOME_POSTS = gql`
  {
    feedPosts {
      id
      description
      date
      imageUrl
      createdBy {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

export default GET_HOME_POSTS;
