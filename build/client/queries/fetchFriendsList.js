"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const GET_FRIENDS_LIST = graphql_tag_1.default `
  {
    user {
      id
      friendsList {
        id
        username
        firstName
        lastName
      }
    }
  }
`;
exports.default = GET_FRIENDS_LIST;
