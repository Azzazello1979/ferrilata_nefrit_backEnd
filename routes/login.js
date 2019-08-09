const express = require('express');
require('dotenv').config('.env');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);
const key = process.env.key;
const salt = process.env.salt;
const sha256 = require('sha256');
mongoose.set('useFindAndModify', false);


router.post('/', (req, res) => {
  if (req.headers["content-type"] !== 'application/json') {
    return res.status(400).json({
      "message": "Content-type is not specified."
    });
  }
  Users.find({ username: `${req.body.username}`, password: `${sha256(req.body.password + salt)}` }, (err, items) => {
    if (err) {
      return res.status(500).json({
        'message': 'Something went wrong, please try again later.'
      });
    } else {
      if (items.length < 1) {
        return res.status(401).json({
          'message': 'Wrong username or password.'
        });
      } else {
        let refreshToken = jwt.sign({ id: items[0]._id, username: items[0].username }, key, { expiresIn: '30d' });
        let token = jwt.sign({ id: items[0]._id, username: items[0].username }, key, { expiresIn: '1hr' });
        let resData = { '_id': items[0]._id, 'username': items[0].username, tokens: { 'jwt': token, 'refreshToken': refreshToken } }
        Users.findOneAndUpdate({ username: req.body.username }, { refreshToken: refreshToken }, { upsert: true }, function (err, doc) {
          return res.status(200).json(resData);
        });
      }
    }
  });
});

  module.exports = router;