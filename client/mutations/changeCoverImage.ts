import gql from 'graphql-tag';

const CHANGE_COVER_PIC = gql`
  mutation ChangeCoverPic($image: Upload) {
    changeCoverImage(image: $image) {
      id
    }
  }
`;

export default CHANGE_COVER_PIC;
