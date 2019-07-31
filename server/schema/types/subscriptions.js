"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const post_type_1 = __importDefault(require("./post_type"));
const user_type_1 = __importDefault(require("./user_type"));
exports.pubsub = new graphql_subscriptions_1.PubSub();
const POST_ADDED = 'newPost';
const NEW_REQUEST = 'newRequest';
const subscription = new graphql_1.GraphQLObjectType({
    name: 'Subscription',
    fields: () => {
        console.log('subscribed');
        return {
            postAdded: {
                type: post_type_1.default,
                args: {
                    Id: { type: graphql_1.GraphQLString }
                },
                subscribe: graphql_subscriptions_1.withFilter(() => exports.pubsub.asyncIterator(POST_ADDED), (payload, variables) => {
                    return payload.friendsList.includes(variables.Id);
                })
            },
            newRequest: {
                type: user_type_1.default,
                args: {
                    id: { type: graphql_1.GraphQLString }
                },
                subscribe: graphql_subscriptions_1.withFilter(() => exports.pubsub.asyncIterator(NEW_REQUEST), (payload, variables) => {
                    return payload.reqUserId === variables.id;
                })
            }
        };
    }
});
exports.default = subscription;
