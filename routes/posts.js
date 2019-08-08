const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const key = process.env.key;
const jwtDecode = require('jwt-decode');
const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);
const middleware = require('../middleware'); // MIGHT USE

function formatUrl(url) {
    let httpString = 'http://'

    if (url.substr(0, httpString.length) !== httpString) {
        url = httpString + url;
    }

    return url;
}

router.post('/', (req, res) => {
    if (req.headers["accept"] === 'application/json') {

    }
    if (req.headers["content-type"] !== 'application/json') {
        return res.status(400).json({
            "message": "Content-type is not specified."
        });
    }
    if (!req.body.title || !req.body.channel || !(req.body.url || req.body.content)) {
        console.log(req.body);
        return res.status(400).json({
            "message": `Missing property`
        });
    }
    if (!req.headers['authorization']) {
        return res.status(401).json({
            "message": "You are not authenticated."
        })
    } else {
        let token = req.headers['authorization'];
        token = token.slice(7, token.length);
        jwt.verify(token, key, (err) => {
            if (err) {
                return res.status(401).json({
                    "message": "You are not authenticated"
                })
            } else {
                const userId = jwtDecode(token).id
                const newPost = new Posts({
                    "title": req.body.title,
                    "content": req.body.content,
                    "channel": req.body.channel,
                    "timestamp": new Date(),
                    "userId": userId,
                    "upVotes": [],
                    "downVotes:": [],
                    "url": formatUrl(req.body.url),
                });
                newPost.save((err, createdPost) => {
                    if (err) {
                        return res.status(500).json({ "message": "Something went wrong, please try again later." });
                    } else {
                        res.status(200).json(createdPost);
                    }
                })
            }
        })
    }
})

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