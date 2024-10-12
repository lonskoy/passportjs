const bookSchema = require("../models/books.model.js");
const idGenerator = require("node-unique-id-generator");
const fs = require('fs')
const { updateCounter, readCounter } = require('../helpers/utils');

class BooksController {
  async getBooks(req, res) {
    try {
      // Проверяем, есть ли активная сессия для passport.js
      if (req.isAuthenticated()) {
        // Если пользователь авторизован, получаем данные о книгах
        const data = await bookSchema.find();
        res.render("index", {
          title: "Главная",
          books: data,
        });
      } else {
        // Если сессии нет, перенаправляем на страницу входа
        res.render("login");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Ошибка сервера при отображении библиотеки");
    }
  }

  async getBook(req, res) {
    try {
      const { id } = req.params;
      updateCounter(id);
      const findBook = await bookSchema.findById(id);
      if (!findBook) {
        return res
          .status(404)
          .send(JSON.stringify({ message: "Книга не найдена!" }))
          .end();
      }
      res.render("view", {
        title: "Главная",
        book: findBook, 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Ошибка сервера при отображении книги с id: ${id}`);
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const deleteBook = await bookSchema.findById(id);
      const pathDeleteBook = deleteBook.pathTemp

      fs.unlink(pathDeleteBook, (err)=> {
        if(err) {
          console.log('Ошибка при удалении файла книги')
        }
       else {
        console.log(`Файл ${pathDeleteBook} успешно удален.`);
    }
      })
      
      await bookSchema.findByIdAndDelete(id);
      const findBook = await bookSchema.find();
      res.render("index", {
        title: "Главная",
        books: findBook,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Ошибка сервера при удалении книги с id: ${id}`);
    }
  }

  async createBook(req, res) {
    res.render("create");
  }

  async createBookPost(req, res) {
    try {
      const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        pathTemp
      } = req.body;
      let fileBook = ''

      if (req.file){
        fileBook = req.file.path

      }
      const id = idGenerator.generateUniqueId();
      const newBook = {
        id,
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
        pathTemp
      };

      await bookSchema.create(newBook);

      const books = await bookSchema.find();
      res.render('index', {title: 'Библиотека', books: books})
    } catch (error) {
      console.log(error)
      res.status(500).send("Ошибка при добавлении книги");
    }
  }

  async updateBookGet(req, res) {
    try {
      const { id } = req.params;
      const findBook = await bookSchema.findById(id);
      res.render("update", { book: findBook });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send(`Ошибка сервера при редактировании книги`);
    }
  }

  async updateBookPost(req, res) {
    try {
      const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        pathTemp
      } = req.body;

      const payLoad = {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        pathTemp
      }
      if (req.file) {
        payLoad.fileBook = req.file.path
      }
      const { id } = req.params;

      await bookSchema.findByIdAndUpdate(id, payLoad);

      const books = await bookSchema.find();
      res.render('index', {title: 'Библиотека', books: books})

    } catch (error) {
      res
        .status(500)
        .send('Ошибка сервера при сохранении исправлений в книге');
        console.log(error)
    }
  }
}

module.exports = BooksController;
