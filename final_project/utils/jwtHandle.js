const { verify, sign } = require('jsonwebtoken')

const JWT_SECRET = 'tokenTokenToken'

const generateToken = (id) => {
  const jwt = sign({ id }, JWT_SECRET, {
    expiresIn: '2h'
  })
  return jwt
}

const verifyToken = (jwt) => {
  const isValid = verify(jwt, JWT_SECRET)
  return isValid
}

module.exports = { generateToken, verifyToken }
