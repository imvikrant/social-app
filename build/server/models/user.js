"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    firstName: String,
    lastName: String,
    age: {
        type: String
    },
    gender: {
        type: String
    },
    profileImage: {
        file: Buffer,
        mimeType: String
    },
    profileCover: {
        file: Buffer,
        mimeType: String
    },
    requests: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post' }]
});
mongoose_1.default.model('User', UserSchema, 'users');
