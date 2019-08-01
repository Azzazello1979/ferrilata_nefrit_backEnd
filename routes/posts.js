const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const key = process.env.key;

const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);

const middleware = require('../middleware'); // MIGHT USE


router.get('/:channel?', (req, res) => {
    Posts
        .find(req.params.channel ? { channel: req.params.channel } : {})
        .populate({ path: 'userId', select: 'username', model: 'User' })
        .exec()
        .then(posts => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(posts);
        }).catch((err) => res.send(err));
});





router.delete('/:postId', (req, res) => {
    let userId = '0';
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
        return res.status(404).json({
            "message": "There is no such post."
        })
    }
});


module.exports = router;