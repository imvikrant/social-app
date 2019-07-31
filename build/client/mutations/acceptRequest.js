"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const ACCEPT_REQUEST = graphql_tag_1.default `
  mutation acceptRequest($id: String) {
    acceptRequest(id: $id) {
      id
      username
    }
  }
`;
exports.default = ACCEPT_REQUEST;
