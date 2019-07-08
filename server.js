'use strict';

const middleware = require('./middleware');
const mongoose = require('mongoose');
require('dotenv').config('.env');
const port = process.env.port;
const mongoDatabase = process.env.mongoDatabase;
const userCollection = process.env.mongoCollection;
const postsCollection = process.env.mongoCollection2;
const MongoClient = require('mongodb').MongoClient;
const key = process.env.key;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true });
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
        const collection = client.db(mongoDatabase).collection(userCollection);
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
    client.connect(err => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        }
        const collection = client.db(mongoDatabase).collection(postsCollection);
        collection.find({ channel: `${req.body.channel}` }).toArray((err, items) => {
            if (err) {
                res.json(err.toString());
                return;
            };
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(items);
        });
    });
});

app.get('/posts', (req, res) => {
    client.connect(err => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        }
        const collection = client.db(mongoDatabase).collection(postsCollection);
        collection.find().toArray((err, items) => {
            if (err) {
                res.json(err.toString());
                return;
            };
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(items);
        });
    });
});
app.post('/logout', function (req, res) {
    const refreshToken = req.body.refreshToken;

    if (refreshToken in refreshTokens) {
        client.connect(err => {
            if (err) {
                return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
            }
            else {
                const collection = client.db(mongoDatabase).collection(userCollection);
                collection.find({ refreshToken: `${refreshToken}` }).toArray((err, items) => {
                    if (err) {
                        return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
                    } else {
                        if (items.length < 1) {
                            return res.status(404).json({
                                'message': 'There is no such user.'
                            });
                        } else {
                            collection.update({ refreshToken: `${refreshToken}` },
                                { $set: { refreshToken: `` } })
                            delete refreshTokens[refreshToken];
                            res.sendStatus(204);
                        }
                    }
                })
            }
        })
    } else {
        res.status(400).json({ message: 'Missing token.' });
    }
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


app.listen(port, (err) => { console.log(err ? err : `Server listening on port ${port}`) });