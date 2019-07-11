const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  channel: String,
  timestamp: Number,
  userId: String
});

module.exports = postSchema;