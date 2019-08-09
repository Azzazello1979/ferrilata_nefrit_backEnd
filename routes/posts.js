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

const bodyParser = require('body-parser');
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const key = process.env.key;
const middleware = require('../middleware'); // MIGHT USE


const takeOut = (upOrDown, req, res, userId) => {
  downOrUp = {};
  downOrUp[upOrDown] = userId
  Posts.findOneAndUpdate({ _id: req.params.postId }, { $pull: downOrUp }, { new: true } & { upsert: true }, function (err, doc) {
    return res.status(200).json({ doc })
  });
}
const pushIn = (upOrDown, req, res, userId) => {
  downOrUp = {};
  downOrUp[upOrDown] = userId
  Posts.findOneAndUpdate({ _id: req.params.postId }, { $push: downOrUp }, { new: true } & { upsert: true }, function (err, doc) {
    return res.status(200).json({ doc })
  });
}
const takeOutAndPushIn = (output, input, req, res, userId) => {
  upOrDown = {};
  upOrDown[output] = userId
  downOrUp = {};
  downOrUp[input] = userId
  Posts.findOneAndUpdate({ _id: req.params.postId }, { $pull: upOrDown }, { new: true } & { upsert: true }, function (err, doc) {
    Posts.findOneAndUpdate({ _id: req.params.postId }, { $push: downOrUp }, { new: true } & { upsert: true }, function (err, doc) {
      return res.status(200).json(doc);
    });
  });
}
router.patch('/:postId?', (req, res) => {
  let userId = '0';
  if (!req.headers['authorization']) {
    return res.status(401).json({ "message": "You are not authenticated." })
  }
  else if (req.headers['authorization']) {
    let token = req.headers['authorization'];
    token = token.slice(7, token.length);
    jwt.verify(token, key, (err) => {
      if (err) {
        return res.status(401).json({ "message": "You are not authenticated...." })
      } else {
        let decoded = jwt.decode(token);
        userId = decoded.id
        Posts.find({ _id: req.params.postId }, (err, post) => {
          if (err) {
            return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
          } else if (post.length < 1) {
            return res.status(404).json({ "message": "There is no such post." })
          } else if (req.body.liked == true) {
            if (post[0].downVotes.includes(userId)) {
              takeOutAndPushIn('downVotes', 'upVotes', req, res, userId)
            } else if (post[0].upVotes.includes(userId)) {
              takeOut('upVotes', req, res, userId)
            }
            else {
              pushIn('upVotes', req, res, userId)
            }
          } else {
            if (post[0].upVotes.includes(userId)) {
              takeOutAndPushIn('upVotes', 'downVotes', req, res, userId)
            }
            else if (post[0].downVotes.includes(userId)) {
              takeOut('downVotes', req, res, userId)
            } else {
              pushIn('downVotes', req, res, userId)
            }
          }
        })
      }
    })
  }
});

module.exports = router;