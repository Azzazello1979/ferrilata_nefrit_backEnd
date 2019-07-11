const express = require('express');
const router = express.Router();

const User = require('./models/user');
const secret = process.env.secret;
const jwt = require('jsonwebtoken');






// refresh access token backend
router.post('/', (req,res) => {

  // 3. missing content type 400
  if (req.headers["content-type"] !== 'application/json') {
  return res.status(400).json({ "message": "Content-type is not specified." });
  }

  // 5. Missing refreshToken property from request body 400
  if (!req.body.refreshToken) {
  res.setHeader("Content-Type", "application/json");
  return res.status(400).json({ "message": "Missing refreshToken." });
  }

  // check if we have such refresh-token
  User.findOne({refreshToken : req.body.refreshToken})
  .then((user) => {
    if(user){ // such refresh-token exists...now lets see if its a valid one or not
    
    jwt.verify(user.refreshToken, secret, (err) => {
      
      const decoded = jwt.decode(user.refreshToken);

      if(err){ // refresh-token is not valid
        return res.status(401).json({ "message" : "refresh-token is invalid" });
        
      // valid, lets check expiry
      } else if (decoded.exp < (Date.now()/1000)){ // expired!
        
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({"message" : "refresh-token is expired"});
      } else { // valid & not expired, lets generate new access-token & send to frontend

        const userPayload = ({
          username: user.username,
          password: user.password
        })
  
        const newAccessToken = jwt.sign(userPayload, secret, {expiresIn: '300'}); //5 mins
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ "token" : newAccessToken });
      }
    })

    


    }else{
      return res.status(400).json({"message":"user with that refresh-token does not exist"})
    }

  }).catch((err) => console.log('Database error: ' + err));

  })

  module.exports = router;
