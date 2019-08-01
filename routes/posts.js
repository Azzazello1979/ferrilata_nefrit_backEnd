const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);
const jwt = require('jsonwebtoken');
const key = process.env.key;
const jwtDecode = require('jwt-decode');

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
    if (req.headers["content-type"] !== 'application/json') {
        return res.status(400).json({
            "message": "Content-type is not specified."
        });
    }
    if (!req.body.title || !req.body.content || !req.body.channel) {
        return res.status(400).json({
            "message": `Missing property}`
        });
    }
    if (!req.headers['authorization']) {
        return res.status(401).json({
            "message": "You are not authenticated."
        })
    } else if (req.headers['authorization']) {
        let token = req.headers['authorization'];
        token = token.slice(7, token.length);
        jwt.verify(token, key, (err) => {
            if (err) {
                return res.status(401).json({
                    "message": "You are not authenticated...."
                })
            } else {
                let user = jwtDecode(token).username;
                let userId = jwtDecode(token).id
                Users.find({ user },
                    (err, user) => {
                        if (err) {
                            return res.status(500).json({ "message": "Something went wrong, please try again later." });
                        } else {
                            let newPost = new Posts({
                                "title": req.body.title,
                                "content": req.body.content,
                                "channel": req.body.channel,
                                "timestamp": new Date(),
                                "userId": userId,
                                "upVotes": [],
                                "downVotes:": [],
                            });
                            newPost.save((err, createdPost) => {
                                if (err) {
                                    return res.status(500).json({ "message": "Something went wrong, please try again later." });
                                } else {
                                    console.log(createdPost)
                                    res.status(200).json(createdPost);
                                }
                            })
                        }
                    })
            }
        })
    }
})

module.exports = router;