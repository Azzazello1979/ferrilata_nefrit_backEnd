const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelsSchema = new Schema({
    channel: {
        type: String,
        required: true,
    }
})

module.exports = channelsSchema;