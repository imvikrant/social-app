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

interface AddPostData {
  id: string;
}

interface MutationVariables {
  description: string;
  image: File;
}

const CreatePost = ({ open, setModal }) => {
  let fileInput: React.RefObject<HTMLInputElement> = React.createRef();

  console.log('open', open);

  let [description, setDescription] = useState('');
  let [fileName, setFileName] = useState('Choose an image');

  return (
    <Mutation<AddPostData, MutationVariables>
      mutation={ADD_POST}
      // onCompleted={() => refetch()}
      update={(cache, { data: { addPost } }: any) => {
        console.log('start...');
        console.log('staore', cache);
        const { posts } = cache.readQuery({ query: GET_MY_POSTS });

        console.log('posts', posts);
        console.log('addPosts', addPost);

        cache.writeQuery({
          query: GET_MY_POSTS,
          data: { posts: [...posts, addPost] }
        });
      }}
    >
      {(addPost, { data }) => {
        return (
          <Dialog open={open} onClose={() => setModal(false)}>
            <div>
              <form
                className="create-post-form"
                method="POST"
                onSubmit={e => {
                  e.preventDefault();
                  addPost({
                    variables: {
                      description,
                      image: fileInput.current.files[0]
                    }
                  });
                  setModal(false);
                }}
                encType="multipart/form-data"
              >
                <div className="file-upload-container">
                  <div className="file-upload">
                    <Button>BROWSE</Button>
                    <input
                      type="file"
                      ref={fileInput}
                      className="upload"
                      onChange={() =>
                        setFileName(fileInput.current.files[0].name)
                      }
                    />
                  </div>
                  <Caption id="fileuploadurl">{fileName}</Caption>
                </div>

                <TextField
                  className="create-post-textfield"
                  label="Description"
                >
                  <Input
                    value={description}
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      setDescription(e.currentTarget.value)
                    }
                  />
                </TextField>
                <Button outlined type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </Dialog>
        );
      }}
    </Mutation>
  );
};

export default CreatePost;
