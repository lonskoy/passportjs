const express = require('express');
const cors = require('cors'); // разрешает запросы к серверу с разных источников
const bodyParser = require('body-parser'); // преобразовывает POST-запросы отправленные через форму в объект req.body 
const morgan = require('morgan'); // Логирование

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const users = require('./db/users.js')

const booksRouter = require('./routes/booksRouter');
const booksRouterAPI = require('./routes/booksRouterAPI');
const userRouter = require('./routes/userRouter.js')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // middleware в Express, которое используется для парсинга данных из формы, отправленных с Content-Type: application/x-www-form-urlencoded. Оно превращает данные, отправленные через POST-запрос, в объект req.body, с которым затем можно работать в вашем серверном коде.
app.use(express.static('public')); // настраиваем статичную папку для загрузки файлов с сервера
app.use(morgan('dev')); // Логирование запросов


app.use(session({ secret: process.env.SECRET}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/user', userRouter )
app.use('/api', booksRouterAPI);
app.use('/', booksRouter);

//                                      ----------------> Настройка passportJs
const verify = (username, password, done) => {
  users.findByUsername(username, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!users.verifyPassword(user, password)) return done(null, false);
      return done(null, user);
  });
};

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => { // начало сессии
  cb(null, user.id)
})

passport.deserializeUser( (id, cb) => { //окончание сессии
  users.findById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})
//                                       <---------------- Настройка passportJs



module.exports = app;