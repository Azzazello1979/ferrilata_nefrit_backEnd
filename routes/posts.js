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


// router.get('/', (req, res) => {

//   Posts.find().then((post) => {
//     console.log("Sziiiaaa");
//     console.log(post);
//     res.status(200).json(post);
//   }).catch((err) => console.log(err));

// })

router.get('/', (req, res) => {

  const user = new Users({
    _id: mongoose.Types.ObjectId,
    username: String,
    password: String,
    refreshToken: String
  })
  const post = new Posts({
    _id: mongoose.Types.ObjectId,
    title: String,
    content: String,
    channel: String,
    timestamp: String,
    userId: this.userId = user._id
  }); 

  Users.find().then((items1) => {
    const users = items1;
    Posts.find().then((items2) => {
      const posts = items2;
      for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (posts[i].userId === users[j]._id) {
            posts[i].userId = users[j].username
          }
          console.log(users[j].username);
        }
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json();
    }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
});


module.exports = router;