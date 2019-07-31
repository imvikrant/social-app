"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_apollo_1 = require("react-apollo");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fetchRequests_1 = __importDefault(require("./../queries/fetchRequests"));
const RequestList_1 = __importDefault(require("./RequestList"));
const SUBSCRIPTION = graphql_tag_1.default `
  subscription newRequest($id: String!) {
    newRequest(id: $id) {
      id
      firstName
      lastName
      username
    }
  }
`;
function Requests() {
    return (react_1.default.createElement(react_apollo_1.Query, { query: fetchRequests_1.default }, ({ loading, error, data, subscribeToMore }) => {
        if (loading)
            return 'loading...';
        if (error)
            return 'error...';
        console.log('REQ', data);
        return (react_1.default.createElement(RequestList_1.default, { data: data, subscribeToRequests: () => subscribeToMore({
                document: SUBSCRIPTION,
                variables: { id: localStorage.getItem('social-app-id') },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data)
                        return prev;
                    const user = subscriptionData.data.newRequest;
                    console.log('subscription data', subscriptionData);
                    console.log('pre', prev);
                    return Object.assign({}, prev, {
                        user: Object.assign({}, prev.user, { requests: prev.user.requests.concat(subscriptionData.data.newRequest) })
                    });
                }
            }) }));
    }));
}
exports.default = Requests;
