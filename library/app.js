const express = require('express');
const cors = require('cors'); // разрешает запросы к серверу с разных источников
const bodyParser = require('body-parser'); // преобразовывает POST-запросы отправленные через форму в объект req.body 
const mongoose = require('mongoose');

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const users = require('./db/users.js')

const http = require('http');
const socketIO = require('socket.io');


const booksRouter = require('./routes/booksRouter');
const booksRouterAPI = require('./routes/booksRouterAPI');
const userRouter = require('./routes/userRouter.js')

const app = express();
app.use(express.urlencoded()); // middleware в Express, которое используется для парсинга данных из формы, отправленных с Content-Type: application/x-www-form-urlencoded. Оно превращает данные, отправленные через POST-запрос, в объект req.body, с которым затем можно работать в вашем серверном коде.
app.use(express.static('public')); // настраиваем статичную папку для загрузки файлов с сервера

const server = http.Server(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(session({ secret: process.env.SECRET}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/user', userRouter )
app.use('/api', booksRouterAPI);
app.use('/', booksRouter);

//                                      ----------------> Настройка passportJs
const verify = (username, password, done) => {
  users.findByUsername(username, (err, user) => {
      if (err) {return done(err)}
      if (!user) { return done(null, false) }

      if( !users.verifyPassword(user, password)) {
          return done(null, false)
      }

      return done(null, user)
  })
}

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


//                                       ----------------->Настройка Socket
io.on('connection', (socket) => {
  const {id} = socket;
  console.log(`Socket connected: ${id}`);

  // работа с комнатами
  const {roomName} = socket.handshake.query;
  console.log(`Socket roomName: ${roomName}`);
  socket.join(roomName);
  socket.on('sendMessage', ({ roomName, message }) => {
    io.to(roomName).emit('message', message); // Отправляем сообщение всем в комнате, включая отправителя
  });

  socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
  });
});
//                                       <---------------- Настройка Socket



const start = async() => {
    try {
        mongoose.connect(
            process.env.BDCONNECT
        );
        server.listen(3003)
        console.log('Подключение к БД прошло успешно!')
    } catch (error) {
        console.log(`Ошибка подключения к БД:  ${error}`)
    }
}

start();

module.exports = app;