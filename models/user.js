const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String
  }
}));

exports.User = User;


