'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config('.env');
const bodyParser = require('body-parser');
const port = process.env.port;
const uri = process.env.uri;
const cors = require('cors');
const refreshTokenRoute = require('./routes/refresh-token');





//Routes
app.use(cors());

app.use('/refresh-token', refreshTokenRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Mongoose stop deprecation warning - needed to use unique:true @ schemas
mongoose.set('useCreateIndex', true);

//Mongoose connection
const db = mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to db")
  })
  .catch(() => {
    console.log("Connection failed")
  });


app.listen(port, (err) => {
  console.log(err ? err : `Server listening on port ${port}`)
});