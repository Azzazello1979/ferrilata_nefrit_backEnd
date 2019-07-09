const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  channel: String,
  timestamp: Number,
  userId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Post', postSchema);