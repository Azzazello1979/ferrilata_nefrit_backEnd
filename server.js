const express = require('express')
const app = express()
const bodyParser = require('bodyParser')
const jwt = require('jsonwebtoken')
const User = require('models/user')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 3000


app.use(cors())
app.use(bodyParser.json())




app.get('/' , (req,res) => {
  res.status(200).send("OK, backend connected to frontend.")
})

app.listen(PORT, ()=>{
  console.log(`OK...Express listening on ${PORT}`)
})
