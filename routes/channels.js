const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);

router.get('/', (req, res) => {
    Posts.find({}, (err, items) => {
        if (err) {
            res.json(err.toString());
            return;
        };
        res.setHeader("Content-Type", "application/json");
        res.status(200).json([...new Set(items.map(posts => posts.channel))]);
    });
});

module.exports = router;