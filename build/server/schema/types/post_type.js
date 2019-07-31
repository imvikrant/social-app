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
const user_type_1 = __importDefault(require("./user_type"));
const mongoose_1 = __importDefault(require("mongoose"));
const Post = mongoose_1.default.model('Post');
const PostType = new graphql_1.GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: {
            type: graphql_1.GraphQLID
        },
        date: {
            type: graphql_1.GraphQLString
        },
        description: {
            type: graphql_1.GraphQLString
        },
        imageUrl: {
            type: graphql_1.GraphQLString,
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const post = yield Post.findById(parent.id);
                    if (post.image.file) {
                        return `/uploads/${post.id}`;
                    }
                    else
                        return '';
                });
            }
        },
        createdBy: {
            type: user_type_1.default,
            resolve(parent) {
                return __awaiter(this, void 0, void 0, function* () {
                    const post = yield Post.findById(parent.id)
                        .populate('createdBy')
                        .exec();
                    return post.createdBy;
                });
            }
        }
    })
});
exports.default = PostType;
