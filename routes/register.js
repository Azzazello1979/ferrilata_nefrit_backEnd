const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const userSchema = require('./../models/user');
const User = mongoose.model('User', userSchema , users);

const secret = process.env.secret;

// body-parser is needed to populare req.body!
const bodyParser = require('body-parser');
router.use(bodyParser.json());


// REGISTER new user end point
router.post('/', (req, res) => {

  // missing content type, 400 error
  if (req.headers["content-type"] !== 'application/json') {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ "message": "Content-type is not specified." });
    return;
  }


  // missing property from req. body, 400 error
  if (!req.body.username && !req.body.password) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ "message": "Missing username and password" });
    return;

  } else if (!req.body.username) {

    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ "message": "Missing username" });
    return;

  } else if (!req.body.password) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ "message": "Missing password" });
    return;
  }

  const userData = req.body;
  

  const newUserPayload = ({
    username: userData.username
  });

  const startAccessToken = jwt.sign( newUserPayload , secret, { expiresIn: '300' }); // 5 mins.

  const startRefreshToken = jwt.sign( newUserPayload , secret, { expiresIn: '30d' }); // 30 days.

  User.findOne({ username: userData.username }) //look up in database if such username is already registered
    .then((user) => {
      if (user) { // if we already have such username...
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ "message": "Username is already taken." });
      } else { // ..if not, let's register user...
        let user = new User({
          "password": userData.password,
          "username": userData.username,
          "refreshToken": startRefreshToken
        });
        user.save((err, registeredUser) => {
          if (err) {
            res.setHeader("Content-Type", "application/json");
            res.status(503).json({ "message": "Error saving user to database." });
            return;

          } else {
            res.setHeader("Content-Type", "application/json");
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
      (err) => res.status(500)
      .json({"message": "Something went wrong, please try again later." })
      .console.log('Error '+ err)
    );


})

module.exports = router;
