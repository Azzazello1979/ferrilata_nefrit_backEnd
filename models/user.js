const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    username: {
        type: String,
        required: true,
        ref: 'Post'
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = userSchema;