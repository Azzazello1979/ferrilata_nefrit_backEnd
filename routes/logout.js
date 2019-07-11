const express = require('express');
const router = express.Router();


router.post('/', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
      res.status(400).json({ message: 'Missing token.' });
  } else {
      client.connect(err => {
          if (err) {
            return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
          }
          else {
              const collection = client.db(mongoDatabase).collection(userCollection);
              collection.find({ refreshToken: `${refreshToken}` }).toArray((err, items) => {
                  if (err) {
                      return res.status(500).json({ 'message': 'Something went wrong, please try again later.' });
                  } else {
                      if (items.length < 1) {
                          return res.status(404).json({
                              'message': 'There is no such user.'
                          });
                      } else {
                          collection.update({ refreshToken: `${refreshToken}` },
                              { $set: { refreshToken: `` } })
                          res.sendStatus(204);
                      }
                  }
              })
          }
      })
  }
});



module.exports = router;