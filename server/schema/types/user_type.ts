import PostType from './post_type';
import mongoose from 'mongoose';

const User = mongoose.model('User');

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} from 'graphql';

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    age: {
      type: GraphQLString
    },
    gender: {
      type: GraphQLString
    },
    requests: {
      type: new GraphQLList(UserType),
      async resolve(parent: any) {
        const requests: { requests: [String] } | any = await User.findOne({
          username: parent.username
        })
          .populate('requests')
          .exec();
        return requests.requests;
      }
    },
    friendsList: {
      type: new GraphQLList(UserType),
      async resolve(parent: any) {
        const friends: { friends: [String] } | any = await User.findOne({
          username: parent.username
        })
          .populate('friends')
          .exec();
        return friends.friends;
      }
    }
  })
});

export default UserType;
