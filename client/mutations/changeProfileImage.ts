import gql from 'graphql-tag';

const CHANGE_PROFILE_PIC = gql`
  mutation ChangeProfilePic($image: Upload) {
    changeProfileImage(image: $image) {
      id
    }
  }
`;

export default CHANGE_PROFILE_PIC;
