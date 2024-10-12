const express = require("express");
const userControllerApi = require("../controllres/userControllerAPI.js");
const router = express.Router();
const bookSchema = require("../models/books.model.js");
const passport = require("passport");

const userController = new userControllerApi();

router.get("/login", userController.login.bind(userController));

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/api/user/login" }),
  async (req, res) => {  // Добавляем async для использования await
    try {
      const data = await bookSchema.find();
      console.log("req.user: ", req.user);
      res.render("index", { title: "Главная", books: data });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).send("Ошибка сервера при загрузке книг.");
    }
  }
);

router.get("/profile", userController.profile.bind(userController));
router.get("/logout", userController.logOut.bind(userController));

module.exports = router;
