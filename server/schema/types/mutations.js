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
const util_1 = __importDefault(require("util"));
// import stream from 'stream'
const mongoose_1 = __importDefault(require("mongoose"));
const User = mongoose_1.default.model('User');
const Post = mongoose_1.default.model('Post');
const user_type_1 = __importDefault(require("./user_type"));
const post_type_1 = __importDefault(require("./post_type"));
const apollo_upload_server_1 = require("apollo-upload-server");
const subscriptions_1 = require("./subscriptions");
const stream_to_array_1 = __importDefault(require("stream-to-array"));
const sharp_1 = __importDefault(require("sharp"));
const POST_ADDED = 'newPost';
const NEW_REQUEST = 'newRequest';
const mutation = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPost: {
            type: post_type_1.default,
            args: {
                description: { type: graphql_1.GraphQLString },
                image: { type: apollo_upload_server_1.GraphQLUpload }
            },
            resolve(parentValue, { description, image }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('hey');
                    if (!image) {
                        const post = yield new Post({
                            description,
                            createdBy: request.user.id
                        }).save();
                        subscriptions_1.pubsub.publish(POST_ADDED, {
                            postAdded: post,
                            friendsList: request.user.friends
                        });
                        return post;
                    }
                    const { filename, mimetype, createReadStream } = yield image;
                    const stream = createReadStream();
                    return stream_to_array_1.default(stream)
                        .then(function (parts) {
                        const buffers = parts.map(part => util_1.default.isBuffer(part) ? part : Buffer.from(part));
                        return Buffer.concat(buffers);
                    })
                        .then((buffer) => __awaiter(this, void 0, void 0, function* () {
                        const buf = yield sharp_1.default(buffer)
                            .resize(250)
                            .toBuffer();
                        const post = yield new Post({
                            image: { file: buf, mimeType: mimetype },
                            description,
                            createdBy: request.user.id
                        }).save();
                        subscriptions_1.pubsub.publish(POST_ADDED, {
                            postAdded: post,
                            friendsList: request.user.friends
                        });
                        return post;
                    }));
                    // return post
                });
            }
        },
        changeProfileImage: {
            type: user_type_1.default,
            args: {
                image: { type: apollo_upload_server_1.GraphQLUpload }
            },
            resolve(parentValue, { image }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('hey new profile pic');
                    const { filename, mimetype, createReadStream } = yield image;
                    const stream = createReadStream();
                    return stream_to_array_1.default(stream)
                        .then(function (parts) {
                        const buffers = parts.map(part => util_1.default.isBuffer(part) ? part : Buffer.from(part));
                        return Buffer.concat(buffers);
                    })
                        .then((buffer) => __awaiter(this, void 0, void 0, function* () {
                        const buf = yield sharp_1.default(buffer)
                            .resize(250)
                            .toBuffer();
                        // const user: { id: String } | any = await new Post({
                        //   image: { file: buf, mimeType: mimetype },
                        //   description,
                        //   createdBy: request.user.id
                        // }).save();
                        const user = yield User.findById(request.user.id);
                        user.profileImage = { file: buf, mimeType: mimetype };
                        user.save();
                        // pubsub.publish(POST_ADDED, {
                        //   postAdded: post,
                        //   userId: request.user.id
                        // });
                        return user;
                    }));
                    // return post
                });
            }
        },
        changeCoverImage: {
            type: user_type_1.default,
            args: {
                image: { type: apollo_upload_server_1.GraphQLUpload }
            },
            resolve(parentValue, { image }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('hey new profile pic');
                    const { filename, mimetype, createReadStream } = yield image;
                    const stream = createReadStream();
                    return stream_to_array_1.default(stream)
                        .then(function (parts) {
                        const buffers = parts.map(part => util_1.default.isBuffer(part) ? part : Buffer.from(part));
                        return Buffer.concat(buffers);
                    })
                        .then((buffer) => __awaiter(this, void 0, void 0, function* () {
                        const buf = yield sharp_1.default(buffer).toBuffer();
                        // const user: { id: String } | any = await new Post({
                        //   image: { file: buf, mimeType: mimetype },
                        //   description,
                        //   createdBy: request.user.id
                        // }).save();
                        const user = yield User.findById(request.user.id);
                        user.profileCover = { file: buf, mimeType: mimetype };
                        user.save();
                        // pubsub.publish(POST_ADDED, {
                        //   postAdded: post,
                        //   userId: request.user.id
                        // });
                        return user;
                    }));
                    // return post
                });
            }
        },
        updateUser: {
            type: user_type_1.default,
            args: {
                firstName: { type: graphql_1.GraphQLString },
                lastName: { type: graphql_1.GraphQLString },
                age: { type: graphql_1.GraphQLString },
                gender: { type: graphql_1.GraphQLString } // 'm' or 'f'
            },
            resolve(parentValue, { firstName, lastName, gender, age }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.findById(request.user.id);
                    console.log(firstName, lastName, gender, age);
                    if (firstName)
                        user.firstName = firstName;
                    if (lastName)
                        user.lastName = lastName;
                    if (gender)
                        user.gender = gender;
                    if (age)
                        user.age = age;
                    yield user.save();
                    return user;
                });
            }
        },
        newRequest: {
            type: user_type_1.default,
            args: {
                id: { type: graphql_1.GraphQLString }
            },
            resolve(p, { id }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    let userToReq = yield User.findById(id);
                    if (userToReq.requests && userToReq.requests.includes(request.user.id))
                        throw new Error('request already made');
                    userToReq.requests.push(new mongoose_1.default.mongo.ObjectID(request.user.id));
                    userToReq = yield userToReq.save();
                    const requestedUser = yield User.findById(request.user.id);
                    subscriptions_1.pubsub.publish(NEW_REQUEST, {
                        newRequest: requestedUser,
                        reqUserId: userToReq.id
                    });
                    return userToReq;
                });
            }
        },
        acceptRequest: {
            type: user_type_1.default,
            args: {
                id: { type: graphql_1.GraphQLString }
            },
            resolve(p, { id }, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('request accept');
                    const user = yield User.findById(request.user.id);
                    const user2 = yield User.findById(id);
                    user.requests = user.requests.filter(u_id => u_id.toString() !== id);
                    user.friends.push(new mongoose_1.default.mongo.ObjectID(id));
                    user2.friends.push(new mongoose_1.default.mongo.ObjectID(request.user.id));
                    user.save();
                    user2.save();
                    return user2;
                });
            }
        }
    }
});
exports.default = mutation;
