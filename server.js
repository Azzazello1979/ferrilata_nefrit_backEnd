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
const middleware = require('./middleware'); // TO BE USED LATER
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const uri = process.env.uri

//Routes
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/channels', channelsRoute);
app.use('/posts', postsRoute);



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