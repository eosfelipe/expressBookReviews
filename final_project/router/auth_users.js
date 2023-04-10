const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const { generateToken } = require('../utils/jwtHandle.js')
const regd_users = express.Router()

let users = []
//refactor type ok key reviews
// books = Object.keys(books).map((book) => ({ ...books[book], reviews: [] }))

const isValid = (username) => {
  //returns boolean
  return users.find((user) => user.username === username)
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(
    (user) => user.username === username && user.password === password
  )

  return user
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const { username, password } = req.body
  req.session.authorization = null
  if (!isValid(username))
    return res.status(200).json({ message: 'User not exist' })

  if (!authenticatedUser(username, password)) {
    return res.status(200).json({ message: 'username or password invalid' })
  }

  const token = generateToken(username)
  users = users.map((user) => {
    if (user.username === username) {
      return { ...user, token }
    }
    return { ...user }
  })
  req.session.authorization = { accessToken: token, username }
  return res.status(200).json({ success: true, user: { username, token } })
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const { isbn } = req.params
  const { body } = req
  const { username } = req.session.authorization
  const book = books[isbn]
  const existingReview = book.reviews.find((review) => review.user === username)

  if (existingReview) {
    existingReview.text = body.reviews
  } else {
    book.reviews.push({ user: username, text: body.reviews })
  }

  res.status(200).json({ success: true, data: books[isbn] })
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params
  const { username } = req.session.authorization
  const book = books[isbn]

  const reviewIndex = book.reviews.findIndex(
    (review) => review.user === username
  )
  if (reviewIndex !== -1) {
    book.reviews.splice(reviewIndex, 1)
    res
      .status(200)
      .json({ success: true, message: `review deleted ${book.title}` })
  } else {
    res.status(200).json({
      success: true,
      message: `No review of ${username} was found in the book ${book.title}`
    })
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
