const jwt = require('jsonwebtoken');
const key = process.env.key;

function checkToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  token = token.slice(7, token.length);
  let decoded = jwt.decode(token);
  if (decoded.exp < (Date.now() / 1000)) {
    return res.status(401).json({
      message: 'Expired Token'
    });
  } else if (token) {
    jwt.verify(token, key, (err) => {
      if (err) {
        return res.status(401).json({
          message: 'Token is not valid'
        });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Missing Token'
    });
  }
};
module.exports = checkToken;