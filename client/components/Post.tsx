import React from 'react';
import MaterialIcon from '@material/react-material-icon';
import {
  Body1,
  Headline6,
  Subtitle2,
  Subtitle1,
  Caption,
  Body2
} from '@material/react-typography';
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionIcons
} from '@material/react-card';
import './Post.scss';
import moment from 'moment';

interface IPostProps {
  username: string;
  description: string;
  imageUrl: string;
  date: number;
  profileImageUrl?: string;
}

const Post = ({
  username,
  description,
  imageUrl,
  date,
  profileImageUrl
}: IPostProps) => (
  <Card className="post">
    <CardPrimaryContent>
      <div className="post-title-container">
        <div className="image-title">
          <img className="profile-pic" src={profileImageUrl} />
          <Body1>{username}</Body1>
        </div>
        <Caption>
          Posted on {moment.unix(date).format('MMMM Do, h:mm a')}
        </Caption>
      </div>
      {imageUrl && <CardMedia wide imageUrl={imageUrl} />}
    </CardPrimaryContent>
    <div className="description">
      <Body2>{description}</Body2>
    </div>
  </Card>
);

export default Post;
