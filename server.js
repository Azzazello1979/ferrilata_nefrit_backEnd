'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config('.env');
const bodyParser = require('body-parser');
const port = process.env.port;
const uri = process.env.uri;
const registerRoute = require('./routes/register');
const usersRoute = require('./routes/users');
const messagesRoute = require('./routes/messages');
const refreshTokenRoute = require('./routes/refresh-token');
const cors = require('cors');

app.use(cors());
const bodyParser = require('body-parser');

//Routes
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/channels', channelsRoute);
app.use('/posts', postsRoute);
app.use('/users', usersRoute);
app.use('/register', registerRoute);
app.use('/messages', messagesRoute);
app.use('/refresh-token', refreshTokenRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Mongoose stop deprecation warning - needed to use unique:true @ schemas
mongoose.set('useCreateIndex', true);

//Mongoose connection
mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to db")
  })
  .catch(() => {
    console.log("Connection failed")
  });

app.listen(port, (err) => {
  console.log(err ? err : `Server listening on port ${port}`)
});