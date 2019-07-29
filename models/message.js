const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  timestamp: {
    type: Number,
    default: Date.now(),
    required: true
  }
});

module.exports = messageSchema;
