'use strict';

const middleware = require('./middleware');
require('dotenv').config('.env');
const port = process.env.port;
const mongoDatabase = process.env.mongoDatabase;
const mongoCollection = process.env.mongoCollection;
const MongoClient = require('mongodb').MongoClient;
const key = process.env.key;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true });
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const refreshTokens = {};
const passportOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', (req, res) => {
    if (req.headers["content-type"] !== 'application/json') {
        return res.status(400).json({ "message": "Content-type is not specified." });
    }
    client.connect(err => {
        if (err) {
            return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
        }
        const collection = client.db(mongoDatabase).collection(mongoCollection);
        collection.find({ username: `${req.body.username}`, password: `${req.body.password}` }).toArray((err, items) => {
            if (err) {
                return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
            } else {
                if (items.length < 1) {
                    return res.status(401).json({
                        'message': 'Wrong username or password.'
                    });
                } else {
                    let refreshToken = jwt.sign({ id: items[0]._id, username: items[0].username }, key, { expiresIn: '30d' });
                    let token = jwt.sign({ id: items[0]._id, username: items[0].username }, key, { expiresIn: '1hr' });
                    refreshTokens[refreshToken] = req.body.username;
                    let resData = { '_id': items[0]._id, 'username': items[0].username, tokens: { 'jwt': token, 'refreshToken': refreshToken } }
                    collection.update({ username: `${req.body.username}` },
                        { $set: { refreshToken: `${refreshToken}` } })
                    return res.status(200).json(resData);
                }
            }
        });
    });
});

app.get('/channels', (req, res) => {
    mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }, (err, response) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            const collection = response.db.collection(mongoCollection);
            collection.find().toArray((err, items) => {
                if (err) {
                    res.json(err.toString());
                    return;
                };
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(items);
            });
        };
        response.close();
    });
});

app.get('/posts', (req, res) => {
    mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }, (err, response) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            const collection = response.db.collection(mongoCollection);
            collection.find().toArray((err, items) => {
                if (err) {
                    res.json(err.toString());
                    return;
                };
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(items);
            });
        };
        response.close();
    });
});




app.post('/refresh-token', (req, res) => {

    const refreshToken = req.body.refreshToken;
    let token = "DIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    token = token.slice(7, token.length); // payload part of access token
    let decoded = jwt.decode(token); // decoding payload of token

    mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }, (err, mongoResp) => {
        // 2. internal server error
        if (err) {
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ "message": "Something went wrong, please try again later." });
            return;


            // 3. missing content type
        } else if (req.headers["content-type"] !== 'application/json') {
            res.status(400).json({ "message": "Content-type is not specified." });
            return;


            // 5. Missing refreshToken property from request body
        } else if (!refreshToken) {
            res.setHeader("Content-Type", "application/json");
            res.status(400).json({ "message": "Missing refreshToken." });
            return;


            // 4.a. refresh token is expired
        } else if (decoded.exp < new Date()) {
             res.status(401).json({ message: 'Expired Token' });
             return;
            

            // 4.b. Invalid refresh token
        } else if (token) {
            jwt.verify(token, key, (err) => {
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


    }

    );
})




app.listen(port, (err) => { console.log(err ? err : `Server listening on port ${port}`) })