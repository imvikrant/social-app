import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
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
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

mongoose.model('User', UserSchema, 'users');
