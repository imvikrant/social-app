import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';
import util from 'util';
// import stream from 'stream'
import mongoose from 'mongoose';
const User = mongoose.model('User');
const Post = mongoose.model('Post');
import UserType from './user_type';
import PostType from './post_type';
import { GraphQLUpload } from 'apollo-upload-server';

import { pubsub } from './subscriptions';
import toArray from 'stream-to-array';
import sharp from 'sharp';

const POST_ADDED = 'newPost';
const NEW_REQUEST = 'newRequest';

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPost: {
      type: PostType,
      args: {
        description: { type: GraphQLString },
        image: { type: GraphQLUpload }
      },
      async resolve(parentValue: any, { description, image }, request) {
        console.log('hey');
        if (!image) {
          const post: { id: String } | any = await new Post({
            description,
            createdBy: request.user.id
          }).save();
          pubsub.publish(POST_ADDED, {
            postAdded: post,
            friendsList: request.user.friends
          });
          return post;
        }
        const { filename, mimetype, createReadStream } = await image;
        const stream = createReadStream();

        return toArray(stream)
          .then(function(parts) {
            const buffers = parts.map(part =>
              util.isBuffer(part) ? part : Buffer.from(part)
            );
            return Buffer.concat(buffers);
          })
          .then(async buffer => {
            const buf = await sharp(buffer)
              .resize(250)
              .toBuffer();
            const post: { id: String } | any = await new Post({
              image: { file: buf, mimeType: mimetype },
              description,
              createdBy: request.user.id
            }).save();
            pubsub.publish(POST_ADDED, {
              postAdded: post,
              friendsList: request.user.friends
            });

            return post;
          });

        // return post
      }
    },

    changeProfileImage: {
      type: UserType,
      args: {
        image: { type: GraphQLUpload }
      },
      async resolve(parentValue: any, { image }, request) {
        console.log('hey new profile pic');

        const { filename, mimetype, createReadStream } = await image;
        const stream = createReadStream();

        return toArray(stream)
          .then(function(parts) {
            const buffers = parts.map(part =>
              util.isBuffer(part) ? part : Buffer.from(part)
            );
            return Buffer.concat(buffers);
          })
          .then(async buffer => {
            const buf = await sharp(buffer)
              .resize(250)
              .toBuffer();
            // const user: { id: String } | any = await new Post({
            //   image: { file: buf, mimeType: mimetype },
            //   description,
            //   createdBy: request.user.id
            // }).save();
            const user: any = await User.findById(request.user.id);

            user.profileImage = { file: buf, mimeType: mimetype };
            user.save();
            // pubsub.publish(POST_ADDED, {
            //   postAdded: post,
            //   userId: request.user.id
            // });

            return user;
          });

        // return post
      }
    },

    changeCoverImage: {
      type: UserType,
      args: {
        image: { type: GraphQLUpload }
      },
      async resolve(parentValue: any, { image }, request) {
        console.log('hey new profile pic');

        const { filename, mimetype, createReadStream } = await image;
        const stream = createReadStream();

        return toArray(stream)
          .then(function(parts) {
            const buffers = parts.map(part =>
              util.isBuffer(part) ? part : Buffer.from(part)
            );
            return Buffer.concat(buffers);
          })
          .then(async buffer => {
            const buf = await sharp(buffer).toBuffer();
            // const user: { id: String } | any = await new Post({
            //   image: { file: buf, mimeType: mimetype },
            //   description,
            //   createdBy: request.user.id
            // }).save();
            const user: any = await User.findById(request.user.id);

            user.profileCover = { file: buf, mimeType: mimetype };
            user.save();
            // pubsub.publish(POST_ADDED, {
            //   postAdded: post,
            //   userId: request.user.id
            // });

            return user;
          });

        // return post
      }
    },

    updateUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        age: { type: GraphQLString },
        gender: { type: GraphQLString } // 'm' or 'f'
      },
      async resolve(
        parentValue: any,
        { firstName, lastName, gender, age },
        request
      ) {
        const user: { username: String } | any = await User.findById(
          request.user.id
        );

        console.log(firstName, lastName, gender, age);
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (gender) user.gender = gender;
        if (age) user.age = age;

        await user.save();
        return user;
      }
    },

    newRequest: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(p: any, { id }, request) {
        let userToReq: any = await User.findById(id);
        if (userToReq.requests && userToReq.requests.includes(request.user.id))
          throw new Error('request already made');
        userToReq.requests.push(new mongoose.mongo.ObjectID(request.user.id));
        userToReq = await userToReq.save();
        const requestedUser = await User.findById(request.user.id);
        pubsub.publish(NEW_REQUEST, {
          newRequest: requestedUser,
          reqUserId: userToReq.id
        });
        return userToReq;
      }
    },

    acceptRequest: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(p: any, { id }, request) {
        console.log('request accept');
        const user: any = await User.findById(request.user.id);
        const user2: any = await User.findById(id);
        user.requests = user.requests.filter(u_id => u_id.toString() !== id);
        user.friends.push(new mongoose.mongo.ObjectID(id));
        user2.friends.push(new mongoose.mongo.ObjectID(request.user.id));
        user.save();
        user2.save();
        return user2;
      }
    }
  }
});

export default mutation;
