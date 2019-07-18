const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const key = process.env.key;

const middleware = require('../middleware'); // MIGHT USE

router.get('/:channel?', (req, res) => {
    if (!req.params.channel) {
        Users.find({},
            (err, users) => {
                Posts.find({},
                    (err, posts) => {
                        let sendBackData = [];
                        for (let i = 0; i < posts.length; i++) {
                            for (let j = 0; j < users.length; j++) {
                                if (posts[i].userId.equals(users[j]._id)) {
                                    let payload = {
                                        _id: posts[i]._id,
                                        title: posts[i].title,
                                        content: posts[i].content,
                                        channel: posts[i].channel,
                                        timestamp: posts[i].timestamp,
                                        username: users[j].username
                                    };
                                    sendBackData.push(payload);
                                }
                            }
                        }
                        res.setHeader("Content-Type", "application/json");
                        res.status(200).json(sendBackData);
                    });
            })
    } else {
        Users.find({},
            (err, users) => {
                Posts.find({
                    channel: req.params.channel
                }, (err, posts) => {
                    if (err) {
                        return res.json({
                            "message": "No such channel"
                        })
                    };
                    let sendBackData = [];
                    for (let i = 0; i < posts.length; i++) {
                        for (let j = 0; j < users.length; j++) {
                            if (posts[i].userId.equals(users[j]._id)) {
                                let payload = {
                                    _id: posts[i]._id,
                                    title: posts[i].title,
                                    content: posts[i].content,
                                    channel: posts[i].channel,
                                    timestamp: posts[i].timestamp,
                                    username: users[j].username
                                };
                                sendBackData.push(payload);
                            }
                        }
                    }
                    res.setHeader("Content-Type", "application/json");
                    res.status(200).json(sendBackData);
                })
            })
    }
});

router.delete('/:postId', (req, res) => {
    let userId = '0';
    console.log(req.params.postId);
    if (!req.headers['authorization']) { // MISSING TOKEN
        return res.status(401).json({
            "message": "You are not authenticated."
        })
    } else if (req.headers['authorization']) {
        let token = req.headers['authorization'];
        token = token.slice(7, token.length);
        jwt.verify(token, key, (err) => {
            if (err) { // NOT VALID
                return res.status(401).json({
                    "message": "You are not authenticated...."
                })
            } else {
                let decoded = jwt.decode(token);
                userId = decoded._id
                Posts.find({
                    _id: req.params.postId,
                    userId: userId
                }, (err, posts) => {
                    if (err) { // INTERNAL SERVER ERROR
                        return res.status(500).json({
                            'message': 'Something went wrong, please try again later.'
                        })
                    } else {
                        Posts.findOneAndRemove({
                            _id: req.params.postId
                        }, (err, deletedPost) => {
                            return res.status(200).json({
                                deletedPost
                            })
                        });
                    }

                })
            }
        })
    } else {
        console.log(posts);
        return res.status(404).json({
            "message": "There is no such post."
        })
    }
});


module.exports = router;