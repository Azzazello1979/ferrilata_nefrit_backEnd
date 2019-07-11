'use strict';


require('dotenv').config('.env');
const PORT = process.env.port;
const mongoUser = process.env.mongoUser;
const mongoPassword = process.env.mongoPassword;
const mongoDatabase = process.env.mongoDatabase;


const refreshTokenRoute = require('./routes/refresh-token');


const mongoose = require('mongoose');
const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


//Routes
app.use('/refresh-token', refreshTokenRoute);


app.use(bodyParser.json());
app.use(cors());


const db = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0-siax1.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;
mongoose.set('useCreateIndex', true); // stop DeprecationWarning (node:9125) ... so you can use uniq:true in Schema

// the one connection
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('OK...connected to mongoDB'))
    .catch((err) => console.log('ERROR...connecting to mongoDB ' + err));








  







app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`)
});