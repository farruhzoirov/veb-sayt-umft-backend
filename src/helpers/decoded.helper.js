const jwt = require('jsonwebtoken');

const config = require('../config/config');

function decodedHelper(req, res) {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(401).json({message: "Auth error"})
  }
  return jwt.verify(token, config.JWT_SECRET_KEY);
}

module.exports = decodedHelper