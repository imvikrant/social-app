import React from 'react';
import './PhotoGallery.scss';
import { Query } from 'react-apollo';
import GET_MY_POSTS from '../queries/fetchMyPosts';

const renderImageListItem = (imageUrl, label) => (
  <li className="mdc-image-list__item">
    <div className="mdc-image-list__image-aspect-container">
      <img className="mdc-image-list__image image" src={`${imageUrl}`} />
    </div>
    <div className="mdc-image-list__supporting">
      <span className="mdc-image-list__label">{label}</span>
    </div>
  </li>
);

const renderImageList = (
  imageList: Array<{ imageUrl: string; label: string }>
) => (
  <ul className="mdc-image-list my-image-list mdc-image-list--with-text-protection">
    {imageList.map(({ imageUrl, label }) =>
      renderImageListItem(imageUrl, label)
    )}
  </ul>
);

function PhotoGallery() {
  return (
    <div>
      <Query query={GET_MY_POSTS}>
        {({ loading, error, data }: any) => {
          if (loading) return 'loading';
          if (error) return 'error';

          const imageList = data.posts
            .filter(({ imageUrl }) => Boolean(imageUrl))
            .map(({ id, description }) => ({
              imageUrl: `/uploads/${id}`,
              label: description
            }));
          console.log('imageList', imageList);

          return renderImageList(imageList);
        }}
      </Query>
    </div>
  );
}

export default PhotoGallery;
