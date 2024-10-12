const express = require('express');
const BooksController = require('../controllres/booksController.js');
const router = express.Router();
const fileUploadMiddleware = require('../middleware/file.js')
const pathEdit = require('../middleware/pathEdit.js')

const booksController = new BooksController;

router.get('/', booksController.getBooks.bind(booksController)) // роут для главной страницы
router.get('/books/view/:id', booksController.getBook.bind(booksController)); // роут для просмотра книги по id
router.get('/books/create', booksController.createBook.bind(booksController)); // роут для получения страницы для создания книги
router.post('/books/create', fileUploadMiddleware.single('fileBook'),pathEdit, booksController.createBookPost.bind(booksController)); // роут для отправки запроса на создание книги
router.get('/books/update/:id', booksController.updateBookGet.bind(booksController)); // роут для получения страницы для редактирования книги
router.post('/books/update/:id', fileUploadMiddleware.single('fileBook'),pathEdit, booksController.updateBookPost.bind(booksController)); // роут для отправки запроса на редактирование книги
router.post('/books/delete/:id', booksController.deleteBook.bind(booksController)); // роут для удаления книги

module.exports = router;