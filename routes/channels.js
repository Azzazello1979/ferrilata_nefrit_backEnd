const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
client.connect(err => {
  if (err) {
    return res.status(500).json({
      "message": "Something went wrong, please try again later."
    });
  }
  const collection = client.db(mongoDatabase).collection(postsCollection);
  collection.find({
    channel: `${req.body.channel}`
  }).toArray((err, items) => {
    if (err) {
      res.json(err.toString());
      return;
    };
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(items);
  });
});
});


module.exports = router;