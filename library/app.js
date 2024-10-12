const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const users = require('./db/users.js')

const booksRouter = require('./routes/booksRouter');
const booksRouterAPI = require('./routes/booksRouterAPI');
const userRouter = require('./routes/userRouter.js')

//----------------> Настройка passportJs

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

//<---------------- Настройка passportJs

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(session({ secret: process.env.SECRET}));

app.use(passport.initialize())
app.use(passport.session())



app.use('/api/user', userRouter )
app.use('/api', booksRouterAPI);
app.use('/', booksRouter);

app.use(express.static('public')); // настраиваем статичную папку для загрузки файлов с сервера
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist/'));

// Socket.IO логика
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('chatMessage', (data) => {
        const { room, message } = data;
        io.to(room).emit('message', { message });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const start = async() => {
    try {
        mongoose.connect(
            process.env.BDCONNECT
        );
        console.log('Подключение к БД прошло успешно!')
    } catch (error) {
        console.log(`Ошибка подключения к БД:  ${error}`)
    }
}

start();

module.exports = app;