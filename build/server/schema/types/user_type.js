"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User');
const graphql_1 = require("graphql");
const UserType = new graphql_1.GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: {
            type: graphql_1.GraphQLID
        },
        username: {
            type: graphql_1.GraphQLString
        },
        firstName: {
            type: graphql_1.GraphQLString
        },
        lastName: {
            type: graphql_1.GraphQLString
        },
        email: {
            type: graphql_1.GraphQLString
        },
        age: {
            type: graphql_1.GraphQLString
        },
        gender: {
            type: graphql_1.GraphQLString
        },
        requests: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const requests = yield User.findOne({
                        username: parent.username
                    })
                        .populate('requests')
                        .exec();
                    return requests.requests;
                });
            }
        },
        friendsList: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const friends = yield User.findOne({
                        username: parent.username
                    })
                        .populate('friends')
                        .exec();
                    return friends.friends;
                });
            }
        }
    })
});
exports.default = UserType;
