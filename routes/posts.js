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

mongoose.set('useFindAndModify', false);

// router.get('/', (req, res) => {

//   Posts.find().then((post) => {
//     console.log("Sziiiaaa");
//     console.log(post);
//     res.status(200).json(post);
//   }).catch((err) => console.log(err));

// })


// const user = new Users({
  //   _id: mongoose.Types.ObjectId,
  //   username: {
    //     type: String,
    //     required: true
    //   },
    //   password: String,
    //   refreshToken: String
    // })
    // const post = new Posts({
      //   _id: mongoose.Types.ObjectId,
      //   title: String,
      //   content: String,
      //   channel: String,
      //   timestamp: String,
      //   userId: {
        //     type: String,
        //     ref: 'User',
        //     required: true
        //   }
        // });
//         router.get('/', (req, res) => {
        
//         Users.find().then((items1) => {
//           const users = items1;
//           Posts.find().then((items2) => {
//             const posts = items2;
//             for (let i = 0; i < posts.length; i++) {
//               for (let j = 0; j < users.length; j++) {
//           let id = JSON.stringify(posts[i].userId)
//           console.log(id);
//           if (JSON.stringify(id) === users[j]._id) {
//             posts[i].userId = users[j].username
//           }
//           // console.log(posts[i].userId = users[j].username);
//         }
//       }
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).json(posts);
//       res.status(500).json({
//         "message": "Something went wrong, please try again later."
//       });
//     }).catch((err) => console.log(err));
//   }).catch((err) => console.log(err));
// });

// router.get('/', (req, res) => {

//   Users.find({})((items1) => {
//       const users = items1;
//       Posts.find({})((items2) => {
//           const posts = items2;
//           for (let i = 0; i < posts.length; i++) {
//               let id = JSON.stringify(posts[i].userId)
//               console.log(id);
//               for (let j = 0; j < users.length; j++) {
//                   if (JSON.stringify(id) == JSON.stringify(users[j]._id)) {
//                       posts[i].userId = users[j].username
//                   }
//               }
//           }
//           res.setHeader("Content-Type", "application/json");
//           res.status(200).json(posts);
//       });
//   })
// })

router.delete('/:postId', function (req, res) {
  console.log(req.params.postId);
  Posts.findOneAndRemove({_id: req.params.postId}).then((post)=>{
    res.send(post)
  }).catch(err => console.log(err));
  res.setHeader("Content-Type", "application/json");
  res.sendStatus(204)
})


module.exports = router;