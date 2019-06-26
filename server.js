'use strict';

const express = require('express');
const app = express();
const port = 3000;
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

app.get('/posts', (req, res) => {
    mongo.connect((url), (err, client) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            console.log('database connected');
            const db = client.db('TestDatabase');
            const collection = db.collection('TestCollection');
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            })
        }
        client.close(console.log('closed'));
    })
});

const server = app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port ${port}`);
});