const jwt = require('jsonwebtoken')

const config = require('./config')

exports.sign = (payload) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expires })
}

exports.verify = (token) => {
  return jwt.verify(token, config.jwt.secret)
}
