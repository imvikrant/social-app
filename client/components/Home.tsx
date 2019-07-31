import React, { Component } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { Query } from 'react-apollo';

import { Grid, Row, Cell } from '@material/react-layout-grid';
import MaterialIcon from '@material/react-material-icon';
import Fab from '@material/react-fab';

import Post from './Post';
import './Home.scss';
import GET_HOME_POSTS from './../queries/fetchHomePosts';
import LOADING_GIF from './../assets/loading.gif';
import CreatePost from './CreatePost';
import GET_USER_DETAILS from './../queries/fetchUserDetails';
import HomeFeed from './HomeFeed';

const SUBSCRIPTION = gql`
  subscription postAdded($Id: String!) {
    postAdded(Id: $Id) {
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

export class Home extends Component {
  state = {
    modelOpen: false
  };

  setCreatePostModal = flag => {
    this.setState({ modelOpen: flag });
  };

  render() {
    return (
      <Grid className="home-grid">
        <Row>
          <Cell columns={6} className="home-grid-cell">
            <Query query={GET_USER_DETAILS}>
              {({ loading: l1, data: data1, client }: any) => (
                <Query query={GET_HOME_POSTS}>
                  {({
                    loading: l2,
                    data: data2,
                    refetch,
                    subscribeToMore
                  }: any) => {
                    client.writeData({
                      data: {
                        profileImageUrl: `/profileImage/me?${new Date().getTime()}`,
                        coverImageUrl: `/coverImage/me?${new Date().getTime()}`
                      }
                    });
                    if (l1 || l2)
                      return (
                        <div>
                          <img alt="loading animation" src={LOADING_GIF} />
                        </div>
                      );
                    // if (error) return `Error!home ${error.message}`;
                    // console.log(data)
                    console.log(data1);
                    localStorage.setItem('social-app-id', data1.user.id);

                    return (
                      <>
                        <Fab
                          icon={<MaterialIcon icon="add" />}
                          className="fab"
                          textLabel="Create Post"
                          onClick={() => this.setCreatePostModal(true)}
                        />
                        <CreatePost
                          open={this.state.modelOpen}
                          setModal={this.setCreatePostModal}
                        />
                        <HomeFeed
                          data={data2}
                          subscribeToMore={() =>
                            subscribeToMore({
                              document: SUBSCRIPTION,
                              variables: {
                                Id: localStorage.getItem('social-app-id')
                              },
                              updateQuery: (prev, { subscriptionData }) => {
                                if (!subscriptionData.data) return prev;
                                const post = subscriptionData;
                                console.log('subscription data', post);
                                console.log('pre', prev);
                                return Object.assign({}, prev, {
                                  feedPosts: [
                                    ...prev.feedPosts,
                                    {
                                      ...subscriptionData.data.postAdded
                                    }
                                  ]
                                });
                              }
                            })
                          }
                        />
                      </>
                    );
                  }}
                </Query>
              )}
            </Query>
          </Cell>
        </Row>
      </Grid>
    );
  }
}

export default Home;
