require('dotenv').config('.env');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.port;
const secretKey = process.env.secretKey;
const mongoUser = process.env.mongoUser;
const mongoPassword = process.env.mongoPassword;
const mongoDatabase = process.env.mongoDatabase;


app.use(cors());
app.use(bodyParser.json());


const db = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0-siax1.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;
mongoose.set('useCreateIndex', true); // stop DeprecationWarning (node:9125) ... so you can use uniq:true in Schema

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('OK...connected to mongoDB'))
  .catch((err) => console.log('ERROR...connecting to mongoDB ' + err));




// REGISTER new user end point
app.post('/register', (req, res) => {

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

  } else if (!req.body.password){
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ "message": "Missing password" });
    return;
  }

  let userData = req.body;
  let startRefreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // 22 chars. long rand.string

  let newUserPayload = {
    username: userData.username,
    password: userData.password
  };

  let startAccessToken = jwt.sign({newUserPayload}, secretKey, { expiresIn: '300' }); // 5 mins.

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
            console.log('database error saving user' + err);
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
    }) // 500 internal server error
    .catch(
      (err) => console.log(err)
      );


})






app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`)
});
