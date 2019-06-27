'use strict';

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const mongoDbServer = '127.0.0.1:27017';
const mongoDatabase = '';
const mongoCollection = '';

app.get('/posts', (req, res) => {
    mongoose.connect(`mongodb://${mongoDbServer}/${ mongoDatabase}`, { useNewUrlParser: true }, (err, response) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            console.log('mongodb connected');
            const collection = response.db.collection(mongoCollection);
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            })
        }
        response.close(console.log('mongodb closed'));
    })
})

const backendServerStatus = app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port ${port}`);
});