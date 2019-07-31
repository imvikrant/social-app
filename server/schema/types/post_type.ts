import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID
} from 'graphql';
import UserType from './user_type';
import mongoose from 'mongoose';

const Post = mongoose.model('Post');

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    date: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    imageUrl: {
      type: GraphQLString,
      async resolve(parent: any) {
        const post: any = await Post.findById(parent.id);
        if (post.image.file) {
          return `/uploads/${post.id}`;
        } else return '';
      }
    },
    createdBy: {
      type: UserType,
      async resolve(parent: any) {
        const post: any = await Post.findById(parent.id)
          .populate('createdBy')
          .exec();

        return post.createdBy;
      }
    }
  })
});

export default PostType;
