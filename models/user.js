const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
});


module.exports = userSchema;
