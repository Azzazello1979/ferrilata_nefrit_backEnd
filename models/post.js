const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
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
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: []
    },
    downVotes: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        default: []
    },
    url: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    }
});

module.exports = postSchema;