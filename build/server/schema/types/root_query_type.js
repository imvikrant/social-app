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
const graphql_1 = require("graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const user_type_1 = __importDefault(require("./user_type"));
const post_type_1 = __importDefault(require("./post_type"));
const User = mongoose_1.default.model('User');
const Post = mongoose_1.default.model('Post');
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: user_type_1.default,
            args: {
                username: {
                    type: graphql_1.GraphQLString
                }
            },
            resolve(parentValue, { username }, request) {
                if (!request.isAuthenticated())
                    throw new Error('Authorization error');
                if (username) {
                    return User.findOne({ username });
                }
                else {
                    const u = User.findById(request.user.id);
                    return u;
                }
            }
        },
        users: {
            type: new graphql_1.GraphQLList(user_type_1.default),
            args: {
                searchTerm: {
                    type: graphql_1.GraphQLString
                }
            },
            resolve(parentValue, { searchTerm }) {
                return User.find({
                    username: { $regex: searchTerm, $options: 'i' }
                });
            }
        },
        posts: {
            type: new graphql_1.GraphQLList(post_type_1.default),
            resolve(parentValue, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const posts = yield Post.find({ createdBy: request.user.id });
                    return posts;
                });
            }
        },
        // home posts
        feedPosts: {
            type: new graphql_1.GraphQLList(post_type_1.default),
            resolve(parentValue, args, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    let posts = [];
                    const user = yield User.findById(request.user.id);
                    for (let i in user.friends) {
                        const friendsPosts = yield Post.find({
                            createdBy: user.friends[i]
                        });
                        posts = posts.concat(friendsPosts);
                    }
                    return posts;
                });
            }
        }
        // feedPosts: {
        //   type: new GraphQLList(PostType),
        //   resolve(parentValue: any, args, resquest) {
        //     const p = Post.find({})
        //     return p
        //   }
        // }
    }
});
exports.default = RootQueryType;
