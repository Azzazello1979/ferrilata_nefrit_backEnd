'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config('.env');

const port = process.env.port;

const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const channelsRoute = require('./routes/channels');
const postsRoute = require('./routes/posts');
const middleware = require('./middleware');

const MongoClient = require('mongodb').MongoClient; // ????
const key = process.env.key;
const mongoDB = process.env.mongoDB;
// const client = new MongoClient(mongoDB, {
//   useNewUrlParser: true
// }); // ????
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

//Routes
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/channels', channelsRoute);
app.use('/posts', postsRoute);
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));


//Mongoose connection
const db = mongoose.connect('mongodb+srv://clairvoyant:myfirstmongoDB@cluster0-0pada.mongodb.net/first-test?retryWrites=true&w=majority', {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected to db")
}).catch(() => {
  console.log("Connection failed")
});

app.use(function(err,req,res,next){
  console.log(err);
})

app.listen(port, (err) => {
  console.log(err ? err : `Server listening on port ${port}`)
});