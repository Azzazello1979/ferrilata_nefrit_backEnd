const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const UserSchema = require('./../models/user');
const Users = mongoose.model('User', UserSchema);


router.post('/', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).json({ message: 'Missing token.' });
    } else {
        Users.find({ refreshToken: `${refreshToken}` }, (err, items) => {
            if (err) {
                return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
            } else {
                if (items.length < 1) {
                    return res.status(404).json({
                        'message': 'There is no such user.'
                    });
                } else {
                    Users.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: '' }, { upsert: true }, function (err, doc) {
                        res.sendStatus(204);
                    })
                }
            }
        })
    }
});



module.exports = router;