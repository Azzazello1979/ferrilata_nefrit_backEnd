'use strict';


require('dotenv').config('.env');
const port = process.env.port;
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








// refresh access-token backend
app.post('/refresh-token', (req, res) => {


    // 3. missing content type
    if (req.headers["content-type"] !== 'application/json') {
        res.status(400).json({ "message": "Content-type is not specified." });
        return;


    // 5. Missing refreshToken property from request body
    } else if (!refreshToken) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ "message": "Missing refreshToken." });
        return;
    }

    // check if we have such refresh-token
    User.findOne({refreshToken : req.headers.refreshToken})
        .then((user) => {
            if (user.refreshToken){ // if so, lets see if refresh-token is valid
             const refreshTokenPayload = user.refreshToken.slice(36, user.refreshToken.length);
                jwt.verify(refreshTokenPayload, secret, (err) => {
                    if (err){ // refresh-token is not valid!
                        res.status(401).json( {"message" : "This refresh token is not valid!"} )
                    } else { // refresh-token is valid, lets check its expiry

                    }
                })

            } else {
                res.status(400).json({ "message": "refresh token does not exist"})
            }
        })
        .catch((err) => {
            console.log('Error with database connection: ' + err)
            .res.setHeader("Content-Type", "application/json")
            .res.status(500).json({ "message": "internal server error"})
        })



    // 4.a. refresh token is expired
    if (decoded.exp < new Date()) {
        res.status(401).json({ message: 'Expired Token' });
        return;


        // 4.b. Invalid refresh token
    } else if (tokenPayload) {
        jwt.verify(tokenPayload, key, (err) => {
            if (err) {
                return res.status(401).json({ message: 'Token is not valid' });
            } else {
                next();
            }
        })


        // 1. valid request
    } else if (refreshToken === "RJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c") {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ "token": "DIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" });
    }


})





app.listen(port, (err) => { console.log(err ? err : `Server listening on port ${port}`) })