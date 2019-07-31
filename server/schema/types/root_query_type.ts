import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';
import mongoose from 'mongoose';
import UserType from './user_type';
import PostType from './post_type';
import Friends from './../../../client/components/Friends';

const User = mongoose.model('User');
const Post = mongoose.model('Post');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        username: {
          type: GraphQLString
        }
      },
      resolve(parentValue: any, { username }, request) {
        if (!request.isAuthenticated()) throw new Error('Authorization error');
        if (username) {
          return User.findOne({ username });
        } else {
          const u = User.findById(request.user.id);

          return u;
        }
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        searchTerm: {
          type: GraphQLString
        }
      },
      resolve(parentValue: any, { searchTerm }) {
        return User.find({
          username: { $regex: searchTerm, $options: 'i' }
        });
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parentValue: any, args, request) {
        const posts: any = await Post.find({ createdBy: request.user.id });
        return posts;
      }
    },

    // home posts
    feedPosts: {
      type: new GraphQLList(PostType),
      async resolve(parentValue: any, args, request) {
        let posts: Array<Object> = [];
        const user: any = await User.findById(request.user.id);
        for (let i in user.friends) {
          const friendsPosts: any = await Post.find({
            createdBy: user.friends[i]
          });
          posts = posts.concat(friendsPosts);
        }
        return posts;
      }
    }

    // feedPosts: {
    //   type: new GraphQLList(PostType),
    //   resolve(parentValue: any, args, resquest) {
    //     const p = Post.find({})
    //     return p
    //   }
    // }
  }
});

export default RootQueryType;
