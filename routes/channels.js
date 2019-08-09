const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ChannelsSchema = require('./../models/channels');
const Channels = mongoose.model('Channels', ChannelsSchema);

router.get('/', (req, res) => {
    Channels.find({}, (err, items) => {
        if (err) {
            res.json(err.toString());
            return;
        };
        res.setHeader("Content-Type", "application/json");
        res.status(200).json([...new Set(items.map(channels => channels.channel))]);
    });
});

module.exports = router;