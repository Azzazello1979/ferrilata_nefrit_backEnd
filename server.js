require('dotenv').config('.env')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { User } = require('models/user')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.port
const secretKey = process.env.secretKey
const mongoUser = process.env.mongoUser
const mongoPassword = process.env.mongoPassword
const mongoDatabase = process.env.mongoDatabase


app.use(cors())
app.use(bodyParser.json())

// TEST connection
app.get('/', (req, res) => {
  res.status(200).send("OK, backend connected to frontend.")
})

const db = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0-siax1.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('OK...connected to mongoDB'))
  .catch((err) => console.log('ERROR...connecting to mongoDB ' + err));


// REGISTER new user end point
app.post('/register', (req, res) => {
  let userData = req.body;
  let startRefreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // 22 chars. long rand.string

  let newUserPayload = {
    "username": user.Data.username,
    "password": user.Data.password
  }
  
  let startAccessToken = jwt.sign(newUserPayload, secretKey, { expiresIn: '300' }) // 5 mins.

  User.findOne({ username: userData.username }) //look up in database if such username is already registered
    .then((user) => {
      if (user) { // if we already have such username...
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ "message": "Username is already taken." })
      } else { // ..if not, let's register user...
        let user = new User({
          "username": user.Data.username,
          "password": user.Data.password,
          "refreshToken": startRefreshToken
        })
        user.save((err, registeredUser) => {
          if (err) {
            console.log('database error saving user' + err)
            res.setHeader("Content-Type", "application/json")
            res.status(503).json({ "message": "Error saving user to database." })
            return
          } else {
            res.setHeader("Content-Type", "application/json")
            res.status(200).send(registeredUser)
          }
        })
      }
    }) // 500 internal server error
    .catch((err) =>
      res.setHeader("Content-Type", "application/json"),
      res.status(500).json({ "message": "Something went wrong, please try again later." }))

})







app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`)
})
