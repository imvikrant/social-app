import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Post from './Post';
import './MyPosts.scss';
import GET_MY_POSTS from '../queries/fetchMyPosts';

const MyPosts = () => {
  return (
    <div>
      <Query query={GET_MY_POSTS}>
        {({ loading, error, data }: any) => {
          if (loading) return 'loading';
          if (error) return 'error';

          return (
            <div className="posts">
              {data.posts.map(p => (
                <Post
                  key={Math.random()}
                  date={p.date}
                  description={p.description}
                  imageUrl={p.imageUrl}
                  username={p.createdBy.firstName + ' ' + p.createdBy.lastName}
                  profileImageUrl={`/profileImage/me`}
                />
              ))}
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default MyPosts;
