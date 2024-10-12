
class BooksControllerApi {
  async bookDownLoad(req, res) {
    const { id } = req.params;
    console.log(id);
  }
  
}

module.exports = BooksControllerApi;


// passport.authenticate("local", async (err, user, info) => {
//     if (err) {
//       // Если возникла ошибка в процессе аутентификации
//       console.error('Authentication error:', err);
//       return res.status(500).send("Ошибка аутентификации"); // Отправляем статус 500 при ошибке
//     }

//     if (!user) {
//       // Если пользователь не найден, редирект на /login
//       return res.redirect("/api/user/login");
//     }

//     // В случае успешной аутентификации, выполняем login
    
//       return res.render("profile", { user });

//   })(req, res);
