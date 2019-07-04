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

passport.use(new JwtStrategy(passportOpts, function (jwtPayload, done) {
    const expirationDate = new Date(jwtPayload.exp * 1000);
    if (expirationDate < new Date()) {
        return done(null, false);
    }
    done(null, jwtPayload);
}))

passport.serializeUser(function (user, done) {
    done(null, user.username)
});

app.post('/logout', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) {
        delete refreshTokens[refreshToken];
    }
    res.sendStatus(204);
});

app.post('/refresh', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) {
        const user = { 'username': refreshTokens[refreshToken], }
        const token = jwt.sign(user, key, { expiresIn: 600 });
        res.status(200).json({ jwt: token })
    }
    else {
        res.sendStatus(401);
    }
});

//Define a schema

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    _id: String,
    username: String,
    password: String,
    refreshToken: String
});


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
        // client.close();
    });
});

app.listen(port, (err) => {
    console.log(err ? err : `Server listening on port ${port}`);
});