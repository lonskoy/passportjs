class UserController {

  async login(req, res) {
    try {
      res.render("login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error rendering login page");
    }
  }

  async profile(req, res) {
    try {
      res.render("profile", {user: req.user} );
    } catch (error) {
      console.error(error);
      res.status(500).send("Error rendering login page");
    }
  }

  async logOut(req,res) {
    try {
      res.render("login", {user: req.user} );
    } catch (error) {
      console.error(error);
      res.status(500).send("Error rendering login page");
    }
  }
}


  module.exports = UserController