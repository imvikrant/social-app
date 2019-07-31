import React from 'react';
import About from './About';
import './ProfilePage.scss';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import TabBar from '@material/react-tab-bar';
import Tab from '@material/react-tab';
import PhotoGallery from './PhotoGallery';
import MyPosts from './MyPosts';
import ChangeProfileImage from './ChangeProfileImage';
import Button from '@material/react-button';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
// import { ApolloConsumer } from 'react-apollo';

const IMAGE_URLS = gql`
  {
    profileImageUrl @client
    coverImageUrl @client
  }
`;

export class ProfilePage extends React.Component {
  state = {
    activeTabIndex: 0,
    showModal: false,
    updateType: 'profile'
  };

  renderComponent() {
    console.log(this.state.activeTabIndex);
    if (this.state.activeTabIndex === 0) return <About />;
    else if (this.state.activeTabIndex === 1) return <PhotoGallery />;
    else if (this.state.activeTabIndex === 2) return <MyPosts />;
  }

  setModal = (flag, updateType) => {
    this.setState({ showModal: flag, updateType });
  };

  handleProfileChange = () => {
    this.setModal(true, 'profile');
    console.log('handled profile Change');
  };

  handleCoverChange = () => {
    this.setModal(true, 'cover');
    console.log('handled cover Change');
  };

  rerender = client => {
    if (this.state.updateType === 'cover')
      client.writeData({
        data: {
          coverImageUrl: `/coverImage/me?${new Date().getTime()}`
        }
      });
    else
      client.writeData({
        data: {
          profileImageUrl: `/profileImage/me?${new Date().getTime()}`
        }
      });
  };

  render() {
    console.log('type', this.state.updateType);
    return (
      <div className="profile-page">
        <Query query={IMAGE_URLS}>
          {({ data, client, loading, error }) => {
            console.log('datatdatadfa', data);
            return (
              <>
                <ChangeProfileImage
                  rerender={() => this.rerender(client)}
                  updateType={this.state.updateType}
                  open={this.state.showModal}
                  setModal={this.setModal}
                />
                <div
                  className="cover-image"
                  style={{
                    background: `url(${data.coverImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                >
                  <div id="profile-image-holder">
                    <button
                      onClick={this.handleProfileChange}
                      className="change-profile-image-button"
                    >
                      Change Pic
                    </button>
                    <img className="profile-image" src={data.profileImageUrl} />
                  </div>
                  <Button
                    onClick={this.handleCoverChange}
                    className="change-cover-button"
                    unelevated
                    dense
                  >
                    Change Cover
                  </Button>
                </div>
              </>
            );
          }}
        </Query>
        <Grid className="profile-grid">
          <Row>
            <Cell columns={8} className="profile-grid-cell">
              <TabBar
                className="tab-bar"
                activeIndex={this.state.activeTabIndex}
                handleActiveIndexUpdate={index =>
                  this.setState({ activeTabIndex: index })
                }
              >
                <Tab className="tab">
                  <span className="mdc-tab__text-label">About</span>
                </Tab>
                <Tab className="tab">
                  <span className="mdc-tab__text-label">Photos</span>
                </Tab>
                <Tab className="tab">
                  <span className="mdc-tab__text-label">Posts</span>
                </Tab>
              </TabBar>
              {this.renderComponent()}
            </Cell>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ProfilePage;
