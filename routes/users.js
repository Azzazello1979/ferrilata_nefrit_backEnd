'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const userSchema = require('./../models/user');
const User = mongoose.model('User', userSchema, 'users');

const bodyParser = require('body-parser');
router.use(bodyParser.json());

// list users backend

router.get('/', (req, res) => {
res.setHeader("Content-Type", "application/json");

  if (req.headers["content-type"] !== 'application/json') {
    return res.status(400).json({ "message": "Content-type is not specified." });
  }

  User.find()
    .select({ _id: 1, username: 1 })
    .then(
      (existingUsers) => {
        return res.status(200).send(existingUsers);
      }
    )
    .catch(
      () => {
        return res.status(500).json({ "message": "Something went wrong, please try again later."  });
      }
    )
})

module.exports = router;
