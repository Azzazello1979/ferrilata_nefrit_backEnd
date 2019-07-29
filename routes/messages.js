'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const messageSchema = require('./../models/message');
const Message = mongoose.model('Message', messageSchema, 'messages');
const userSchema = require('./../models/user'); //needed!
const User = mongoose.model('User', userSchema, 'users'); //needed!

const JWTmiddleware = require('./../middleware');

const bodyParser = require('body-parser');
router.use(bodyParser.json());






// delete message by id end point
router.delete('/:messageId', JWTmiddleware, (req, res) => {

  // check 1 & 2: is there an access token & is it valid? ( done by JWTmiddleware )

  res.setHeader("Content-Type", "application/json");


  // check 3: does a message with that id exists in database?
  // what is the username of that message?
  Message
    .findOne({ _id: messageId })
    .populate('from', 'username -_id')
    .select('from.username')
    .then(
      (message) => {
        
        // extract username from access token
        let messageId = req.params.messageId;
        let userNamefromAccessToken = jwt.decode(req.headers['authorization'].slice(7, req.headers['authorization'].lenght)).username;

        if (!message) {
          return res.status(404).json({ "message": "There is no such message." });


          // check 4: message with that id exists, but does it belong to the user that wants to delete the post?
        } else if (message.from.username !== userNamefromAccessToken) {
          return res.status(403).json({ "message": "You don't have permission." });

        } else {
          // message with that id exists in database & it belongs to the user who wants to delete it, go ahead and delete that message
          Message.deleteOne({ _id: messageId })
            .then(
              (OKpacket) => {
                if (OKpacket.deletedCount === 1) {
                  return res.status(204);

                } else {
                  return res.status(500).json({ "message": "Error, message was not deleted" });
                }

              }).catch(
                () => {
                  return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
                })

        }
      }
    )
    .catch(
      () => {
        return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
      }
    )

})


module.exports = router;
