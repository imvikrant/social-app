import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';
import PostType from './post_type';
import UserType from './user_type';

export const pubsub = new PubSub();

const POST_ADDED = 'newPost';
const NEW_REQUEST = 'newRequest';

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: () => {
    console.log('subscribed');
    return {
      postAdded: {
        type: PostType,
        args: {
          Id: { type: GraphQLString }
        },
        subscribe: withFilter(
          () => pubsub.asyncIterator(POST_ADDED),
          (payload, variables) => {
            return payload.friendsList.includes(variables.Id);
          }
        )
      },
      newRequest: {
        type: UserType,
        args: {
          id: { type: GraphQLString }
        },
        subscribe: withFilter(
          () => pubsub.asyncIterator(NEW_REQUEST),
          (payload, variables) => {
            return payload.reqUserId === variables.id;
          }
        )
      }
    };
  }
});

export default subscription;
