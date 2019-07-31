"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const root_query_type_1 = __importDefault(require("./types/root_query_type"));
const mutations_1 = __importDefault(require("./types/mutations"));
const subscriptions_1 = __importDefault(require("./types/subscriptions"));
exports.default = new graphql_1.GraphQLSchema({
    query: root_query_type_1.default,
    mutation: mutations_1.default,
    subscription: subscriptions_1.default
});
