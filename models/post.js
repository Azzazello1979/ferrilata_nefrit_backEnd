const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
<<<<<<< HEAD
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    upVote: {
        type: Array,
        required: false
    },
    downVote: {
        type: Array,
        required: false
    }
=======
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upVotes:{
    type: [mongoose.Schema.Types.ObjectId],
    required:true
  },
  downVotes:{
    type: [mongoose.Schema.Types.ObjectId],
    required:true
  }
>>>>>>> master
});

module.exports = postSchema;