const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true
    },
    password: String,
    refreshToken: String
});

module.exports = userSchema;