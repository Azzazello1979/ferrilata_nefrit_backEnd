const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
      _id: ObjectId,
    username: String,
    password: String,
    refreshToken: String
  
});

module.exports = mongoose.model('User', userSchema);