require("dotenv").config();
const app = require("./app");
const port = process.env.PORT;
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const start = async () => {
  try {
    mongoose.connect(process.env.BDCONNECT);

    console.log("Подключение к БД прошло успешно!");

    const server = app.listen(process.env.PORT, () => {
      console.log(`Server has been started on ${port} port.`);
    });
    
    const io = socketIO(server);

    //                                       ----------------->Настройка Socket

    // Socket.IO configuration
    io.on("connection", (socket) => {
      const { id } = socket;
      console.log(`Socket connected: ${id}`);

      const { roomName } = socket.handshake.query;
      console.log(`Socket roomName: ${roomName}`);
      socket.join(roomName);

      socket.on("sendMessage", ({ roomName, message }) => {
        io.to(roomName).emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${id}`);
      });
    });

    //                                       <---------------- Настройка Socket
  } catch (error) {
    console.log(`Ошибка подключения к БД:  ${error}`);
  }
};

start();
