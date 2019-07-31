import React, { Component } from 'react';
import Post from './Post';

interface IProps {
  data: {
    feedPosts: Array<{
      date: number;
      description: string;
      createdBy: any;
      imageUrl: string;
      id: string;
    }>;
  };
  subscribeToMore: Function;
}

interface IState {}

class HomeFeed extends Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.subscribeToMore();
  }

  render() {
    console.log('feddpost', this.props.data.feedPosts);
    return this.props.data.feedPosts.map(post => (
      <Post
        key={Math.random()}
        date={post.date}
        description={post.description}
        imageUrl={post.imageUrl}
        username={post.createdBy.firstName + ' ' + post.createdBy.lastName}
        profileImageUrl={`/profileImage/${post.createdBy.id}`}
      />
    ));
  }
}

export default HomeFeed;
