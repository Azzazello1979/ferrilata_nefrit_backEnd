'use strict';

// require('dotenv').config('.env');
// const port = process.env.port;
// const mongoDbServer = process.env.mongoDbServer;
// const mongoDatabase = process.env.mongoDatabase;
// const mongoCollection = process.env.mongoCollection;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://clairvoyant:myfirstmongoDB@cluster0-0pada.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3200;
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    mongo.connect((url), (err, client) => {
        if (err) {
            return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
        } else {
            const db = client.db('TestDatabase');
            const collection = db.collection('TestCollection');
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            })
        }
        client.close();
    })
});


//Define a schema
// const User = require('../ferrilata-nefrit-frontend/Reddit/src/app/user.model.ts');
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
        const collection = client.db("first-test").collection("users");
        collection.find({ username: `${req.body.username}`, password: `${req.body.password}` }).toArray((err, items) => {
            if (err) {
                return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
            } else {
                if (items.length < 1) {
                    return res.status(401).json({
                        'message': 'Wrong username or password.'
                    });
                } else {
                    let resData = {
                        '_id': items[0]._id,
                        'username': items[0].username,
                        'token': items[0].token,
                        'refreshToken': items[0].refreshToken
                    }
                    return res.status(200).json(resData);
                }
            }
        });
        // client.close();
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port ${port}`);
});