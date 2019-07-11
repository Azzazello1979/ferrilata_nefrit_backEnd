const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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


module.exports = mongoose.model('User', userSchema, 'users');
// 'js Class' , mongoose Schema , 'name of collection'
