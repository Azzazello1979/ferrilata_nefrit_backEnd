const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
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
        // default: Date.now()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
});

module.exports = postSchema;