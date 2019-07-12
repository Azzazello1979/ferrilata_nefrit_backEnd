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
      (err, items1) => {
        const users = items1;
        Posts.find({},
          (err, items2) => {
            const posts = items2;
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
      (err, items1) => {
        const users = items1;
        Posts.find({ channel: req.params.channel }, (err, items2) => {
          if (err) {
            return res.json({ "message": "No such channel" })
          };
          const posts = items2;
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
})


module.exports = router;