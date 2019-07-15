'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config('.env');
const port = process.env.port;
const uri = process.env.uri
const registerRoute = require('./routes/register');
const cors = require('cors');
const bodyParser = require('body-parser');


//Routes
app.use(cors());

app.use('/register', registerRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


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