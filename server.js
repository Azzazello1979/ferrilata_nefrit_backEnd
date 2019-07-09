const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const {User} = require('models/user')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 3000


app.use(cors())
app.use(bodyParser.json())

// TEST connection
app.get('/', (req, res) => {
  res.status(200).send("OK, backend connected to frontend.")
})

const db = "mongodb+srv://userBalint:passwordBalint@cluster0-siax1.mongodb.net/nefrit?retryWrites=true&w=majority"

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('OK...connected to mongoDB'))
  .catch((err) => console.log('ERROR...connecting to mongoDB ' + err));


// REGISTER new user end point
app.post('/register', (req, res) => {
  let userData = req.body;
  let refreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // 22 chars. long rand.string
  User.findOne({ username: userData.username }) //look up in database if such username is already registered
  .then( (user) => {
    if(user){ // if we already have such username...
      res.status(400).json({"message": "Username is already taken."})
    } else { // ..if not, let's register user...
      let user = new User(userData)
    }
  }) // 500 internal server error
  .catch( (err) => res.status(500).json({"message": "Something went wrong, please try again later."}))

})







app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`)
})
