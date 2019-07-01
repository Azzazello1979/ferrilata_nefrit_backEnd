'use strict';

require('dotenv').config('.env');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port;
const mongoDbServer = process.env.mongoDbServer;
const mongoDatabase = process.env.mongoDatabase;
const mongoCollection = process.env.mongoCollection;

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

const backendServerStatus = app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`Server listening on port ${port}`);
});