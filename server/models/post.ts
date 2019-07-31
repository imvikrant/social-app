import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
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
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

mongoose.model('Post', PostSchema, 'posts')