'use strict';


require('dotenv').config('.env');
const PORT = process.env.port;
const mongoUser = process.env.mongoUser;
const mongoPassword = process.env.mongoPassword;
const mongoDatabase = process.env.mongoDatabase;
const secret = process.env.secret;


const User = require('./models/user');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(cors());


const db = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0-siax1.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;
mongoose.set('useCreateIndex', true); // stop DeprecationWarning (node:9125) ... so you can use uniq:true in Schema

// the one connection
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('OK...connected to mongoDB'))
    .catch((err) => console.log('ERROR...connecting to mongoDB ' + err));






// refresh access token backend
app.post('/refresh-token', (req,res) => {

  // 3. missing content type 400
  if (req.headers["content-type"] !== 'application/json') {
  res.status(400).json({ "message": "Content-type is not specified." });
  return;
  }

  // 5. Missing refreshToken property from request body 400
  if (!refreshToken) {
  res.setHeader("Content-Type", "application/json");
  res.status(400).json({ "message": "Missing refreshToken." });
  return;
  }

  // check if we have such refresh-token
  User.findOne({refreshToken : req.headers.refreshToken})
  .then((user) => {
    // such refresh-token exists...now lets see if its a valid one or not
    jwt.verify(user.refreshToken, secret, (err) => {
      if(err){
        res.status(401).json({ "message" : "refresh-token is invalid" });
        return;
      } else {
        
      // valid, lets check expiry
      const decoded = jwt.decode(user.refreshToken)
      if(decoded.exp < new Date()){
        // expired!
        res.setHeader("Content-Type", "application/json");
        res.status(401).json({"message" : "refresh-token is expired"});
        return;


      } else {
      // valid & not expired, lets generate new access-token & send to frontend
        const userPayload = ({
          username: user.username,
          password: user.password
        })
        const newAccessToken = jwt.sign(userPayload, secret, {expiresIn: '300'}); //5 mins
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ "token" : newAccessToken })
      }

      }
      })


  })

  // internal server error 500
  .catch((err) =>
    console.log('Database error: ' + err),
    res.setHeader("Content-Type", "application/json"),
    res.status(500).json({"message": "Something went wrong, please try again later."})
  );

})




app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`)
});
