import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import ADD_POST from '../mutations/addPost';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton
} from '@material/react-dialog';
import TextField, { Input } from '@material/react-text-field';
import Button from '@material/react-button';
import './CreatePost.scss';
import { Caption } from '@material/react-typography';
import GET_MY_POSTS from './../queries/fetchMyPosts';
import Dropzone from 'react-dropzone';
import CHANGE_PROFILE_PIC from '../mutations/changeProfileImage';
import CHANGE_COVER_PIC from '../mutations/changeCoverImage';
import './ChangeProfileImage.scss';

interface AddPostData {
  id: string;
}

interface MutationVariables {
  image: File;
}

const renderPreview = file => {
  if (file) {
    const fileUrl = URL.createObjectURL(file);
    return <img src={fileUrl} className="preview-image" />;
  } else {
    return (
      <p className="dropzone-p">
        Drag 'n' drop image here, or click to select the image
      </p>
    );
  }
};

const ChangeProfileImage = ({ open, setModal, updateType, rerender }) => {
  const [file, setFile] = useState(undefined);

  console.log('open', open);

  return (
    <Mutation<AddPostData, MutationVariables>
      mutation={updateType === 'cover' ? CHANGE_COVER_PIC : CHANGE_PROFILE_PIC}
      onCompleted={() => {
        rerender();
      }}
    >
      {(changePic, { data, client }) => {
        return (
          <Dialog open={open} onClose={() => setModal(false, updateType)}>
            <div>
              <form
                className="change-profile-form"
                method="POST"
                onSubmit={e => {
                  e.preventDefault();
                  changePic({
                    variables: {
                      image: file
                    }
                  });
                  setModal(false, updateType);
                }}
                encType="multipart/form-data"
              >
                <Dropzone
                  onDrop={acceptedFiles => {
                    setFile(acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="dropzone">
                      <div {...getRootProps()} className="dropzone-div">
                        <input
                          {...getInputProps()}
                          className="dropzone-input"
                        />

                        {renderPreview(file)}
                      </div>
                    </section>
                  )}
                </Dropzone>
                <Button className="update-image" outlined type="submit">
                  Update Image
                </Button>
              </form>
            </div>
          </Dialog>
        );
      }}
    </Mutation>
  );
};

export default ChangeProfileImage;
