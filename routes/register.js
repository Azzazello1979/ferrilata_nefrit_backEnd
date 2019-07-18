const express = require('express');
const router = express.Router();
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = require('./../models/user');
const User = mongoose.model('User', userSchema, 'users');
const key = process.env.key;
const salt = process.env.salt;


// body-parser is needed to populare req.body!
const bodyParser = require('body-parser');
router.use(bodyParser.json());


// REGISTER new user end point
router.post('/', (req, res) => {
res.setHeader("Content-Type", "application/json");

  // missing content type, 400 error
  if (req.headers["content-type"] !== 'application/json') {
    return res.status(400).json({ "message": "Content-type is not specified." });
  }


  // missing property from req. body, 400 error
  if (!req.body.username && !req.body.password) {
    return res.status(400).json({ "message": "Missing username and password" });


  } else if (!req.body.username) {
    return res.status(400).json({ "message": "Missing username" });


  } else if (!req.body.password) {
    return res.status(400).json({ "message": "Missing password" });

  }

  const userData = req.body;
  const newUserPayload = ({
    username: userData.username
  });

  const startAccessToken = jwt.sign(newUserPayload, key, { expiresIn: '300' }); // 5 mins.
  const startRefreshToken = jwt.sign(newUserPayload, key, { expiresIn: '30d' }); // 30 days.

  //look up in database if such username is already registered
  User.findOne({ username: userData.username }) //look up in database if such username is already registered
    .then((registeredUser) => {
      if (registeredUser) { // if we already have such username...
        res.status(400).json({ "message": "Username is already taken." });

      } else { // ..if not, let's register user...
        let newUser = new User({
          "password": sha256(userData.password + salt),
          "username": userData.username,
          "refreshToken": startRefreshToken
        });
        newUser.save((err, registeredUser) => {
          if (err) {
            return res.status(503).json({ "message": "Error saving user to database." });
            
          } else {
            res.status(200).json({
              "_id": registeredUser._id,
              "username": registeredUser.username,
              "token": startAccessToken,
              "refreshToken": registeredUser.refreshToken
            });
          }
        })
      }
    })
    .catch( // 500 internal server error
      () => res.status(500)
        .json({ "message": "Something went wrong, please try again later." })
    );
})

module.exports = router;
