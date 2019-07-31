const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);
const jwt = require('jsonwebtoken');
const key = process.env.key;

router.get('/:channel?', (req, res) => {
    if (!req.params.channel) {
        Users.find({},
            (err, users) => {
                Posts.find({},
                    (err, posts) => {
                        res.setHeader("Content-Type", "application/json");
                        res.status(200).json(posts);
                    });
            })
    } else {
        Users.find({},
            (err, users) => {
                Posts.find({ channel: req.params.channel }, (err, posts) => {
                    if (err) {
                        return res.json({ "message": "No such channel" })
                    };
                    res.setHeader("Content-Type", "application/json");
                    res.status(200).json(posts);
                })
            })
    }
});

router.post('/', (req, res) => {
    console.log(req.body.title, req.body.content, req.body.channel)
    if (req.headers["content-type"] !== 'application/json') {
        return res.status(400).json({
            "message": "Content-type is not specified."
        });
    }
    if (!req.body.title || !req.body.content || !req.body.channel) {
        console.log('2')

        return res.status(400).json({
            "message": `Missing property}`
        });
    }
    if (!req.headers['authorization']) {
        console.log('3')

        console.log('this')

        return res.status(401).json({
            "message": "You are not authenticated."
        })
    } else if (req.headers['authorization']) {
        console.log('noauth')
        let token = req.headers['authorization'];
        token = token.slice(7, token.length);
        jwt.verify(token, key, (err) => {
            if (err) {
                console.log('fuh')
                return res.status(401).json({
                    "message": "You are not authenticated...."
                })
            } else {
                console.log('as')
                let newPost = new Posts({
                    "title": req.body.title,
                    "content": req.body.content,
                    "channel": req.body.channel,
                    "timestamp": new Date() / 1000,
                    "userId": req.body.title,
                    "upVotes": [],
                    "downVotes:": [],
                });
                newPost.save((err, fdsfs) => {
                    console.log(result)
                    if (err) {
                        return res.status(500).json({ "message": "Something went wrong, please try again later." });
                    } else {
                        res.status(200).json({
                            "title": req.body.title,
                            "content": req.body.content,
                            "channel": req.body.channel,
                            "timestamp": new Date() / 1000,
                            "userId": req.header,
                            "upVotes": [],
                            "downVotes:": [],
                        });
                    }
                })
            }
        })
    }
})

module.exports = router;