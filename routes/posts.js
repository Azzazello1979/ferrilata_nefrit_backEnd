const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PostSchema = require('./../models/post');
const Posts = mongoose.model('Post', PostSchema);
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);

router.get('/', (req, res) => {

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
})

module.exports = router;