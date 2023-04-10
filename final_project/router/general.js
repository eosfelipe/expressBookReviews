const express = require('express')
const { nanoid } = require('nanoid')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

// books = Object.keys(books).map((book) => ({ ...books[book], reviews: [] }))

public_users.post('/register', (req, res) => {
  //Write your code here
  const { username, password } = req.body
  if (!username || !password)
    return res
      .status(200)
      .json({ message: 'username or password are not provided' })

  if (isValid(username))
    return res.status(200).json({ message: 'User already exist' })
  users.push({ id: nanoid(), username, password })

  res.status(201).json({
    success: true,
    message: `New user ${username} registration successfully`,
    data: users
  })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, 2000)
  })
  result.then((data) => res.status(200).json({ success: true, books: data }))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params

  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    }, 2000)
  })

  if (isbn > 10) {
    result.then((data) =>
      res.status(404).json({ success: true, message: 'book not found' })
    )
    return
  }

  result.then((data) => res.status(200).json({ success: true, book: data }))
})

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const { author } = req.params
  const book = Object.keys(books).filter(
    (book) => books[book].author === author
  )

  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[book])
    }, 2000)
  })

  if (book.length === 0) {
    // return res.status(404).json({ success: true, message: 'book not found' })
    result.then((data) =>
      res.status(404).json({ success: true, message: 'book not found' })
    )
    return
  }

  result.then((data) => {
    res.status(200).json({
      success: true,
      book: book.length > 1 ? book.map((b) => books[b]) : data
    })
  })
  // return res.status(200).json({
  //   success: true,
  //   book: book.length > 1 ? book.map((b) => books[b]) : books[book]
  // })
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const { title } = req.params
  const book = Object.keys(books).filter((book) => books[book].title === title)

  const result = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[book])
    }, 2000)
  })

  if (book.length === 0) {
    result.then((data) =>
      res.status(404).json({ success: true, message: 'book not found' })
    )
    return
  }

  result.then((data) => {
    res.status(200).json({
      success: true,
      book: book.length > 1 ? book.map((b) => books[b]) : data
    })
  })
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params
  if (isbn > 10)
    return res.status(404).json({ success: true, message: 'book not found' })
  return res.status(200).json({ success: true, reviews: books[isbn].reviews })
})

module.exports.general = public_users
