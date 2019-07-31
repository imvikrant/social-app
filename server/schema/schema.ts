import { GraphQLSchema } from "graphql";

import RootQueryType from './types/root_query_type'
import mutations from './types/mutations'
import subscriptions from './types/subscriptions'

export default new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations,
  subscription: subscriptions
})