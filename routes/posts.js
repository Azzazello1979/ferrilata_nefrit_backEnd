const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);


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

module.exports = router;