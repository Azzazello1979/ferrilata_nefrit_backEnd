const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  if (req.headers["content-type"] !== 'application/json') {
    return res.status(400).json({
      "message": "Content-type is not specified."
    });
  }
  client.connect(err => {
    if (err) {
      return res.status(500).json({
        'message': 'Something went wrong, please try again later.'
      });
    }
    const collection = client.db(mongoDatabase).collection(userCollection);
    collection.find({
      username: `${req.body.username}`,
      password: `${req.body.password}`
    }).toArray((err, items) => {
      if (err) {
        return res.status(500).json({
          'message': 'Something went wrong, please try again later.'
        });
      } else {
        if (items.length < 1) {
          return res.status(401).json({
            'message': 'Wrong username or password.'
          });
        } else {
          let refreshToken = jwt.sign({
            id: items[0]._id,
            username: items[0].username
          }, key, {
            expiresIn: '30d'
          });
          let token = jwt.sign({
            id: items[0]._id,
            username: items[0].username
          }, key, {
            expiresIn: '1hr'
          });
          let resData = {
            '_id': items[0]._id,
            'username': items[0].username,
            tokens: {
              'jwt': token,
              'refreshToken': refreshToken
            }
          }
          collection.update({
            username: `${req.body.username}`
          }, {
            $set: {
              refreshToken: `${refreshToken}`
            }
          })
          return res.status(200).json(resData);
        }
      }
    });
  });
});

module.exports = router;