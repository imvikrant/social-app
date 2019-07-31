"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    image: {
        file: Buffer,
        mimeType: String
    },
    description: {
        type: String
    },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
});
mongoose_1.default.model('Post', PostSchema, 'posts');
