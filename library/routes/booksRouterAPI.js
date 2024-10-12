const express = require('express')
const booksControllerApi = require('../controllres/booksControllerAPI.js')
const router = express.Router()

const booksController = new booksControllerApi();

router.get('/books/:id/download', booksController.bookDownLoad.bind(booksController));

module.exports = router