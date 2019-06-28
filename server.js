'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config('.env');

app.get('/channels', (req, res) => {
    mongoose.connect(`mongodb://${mongoDbServer}/${ mongoDatabase}`, { useNewUrlParser: true }, (err, response) => {
        if (err) {
            return res.status(500).json({ "message": "Something went wrong, please try again later." });
        } else {
            console.log('mongodb connected');
            const collection = response.db.collection(mongoCollection);
            collection.find().toArray((err, items) => {
                if (err) throw err;
                res.status(200).json(items);
            });
        };
        response.close(console.log('mongodb closed'));
    });
});