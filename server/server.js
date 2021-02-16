const express = require('express')
const app =express()
const mysql = require('mysql');
const bodyparser = require('body-parser')
const path = require('path')

const http = require('http').createServer(app)
const io = require('socket.io')(http)
app.use(bodyparser.json())
// Add the credentials to access your database
var mysqlConnection = mysql.createConnection({
  "host"        : "workerzero.cdhxjhrp203p.us-west-1.rds.amazonaws.com",
  "user"        : "admin",
  "password"    : "lTFk5bemjaFpS1cMpx18",
  "database"    : "WorkerZero_Public"
});

mysqlConnection.connect(function(err) {
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }else{
        console.log("db connection succeded");
    }
});

  app.use("/chat_messages", (req, res) => {
    mysqlConnection.query("SELECT * FROM chat_messages", (error, messages) => {
      res.end();
    });
  });
  app.use(express.static(path.join(__dirname, "public")));
  const botName = "Admin✅";
  io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
      mysqlConnection.query("INSERT INTO users (username) VALUES (' " + username + " ')");
      socket.join(user.room);
      socket.emit(
        "message",
        formatMessage(
          botName,
          `${username} you're welcome to laronshalley customer support`
        )
      );
      // broadcast a message when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(
            botName,
            ` ${user.username} has connected to the live chat`
          )
        );
      // get room users
      // io.to(user.room).emit("rootUsers", {
      //   room: user.room,
      //   users: getRoomUsers(room),
      // });
    });
    // listen for events from the client
    socket.on("chatMessage", msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
      mysqlConnection.query("INSERT INTO chat_messages (messages) VALUES (' " + msg + " ')");
    });
    // disconnects when a user closes the tab
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `oops ${user.username} is disconnected`)
        );
      }
      // // get room users
      // io.to(user.room).emit("rootUsers", {
      //   room: user.room,
      //   users: getRoomUsers(room),
      // });
    });
  });
  const PORT = 5000 || process.env.PORT;
  http.listen(PORT, () => console.log("server is listening on port 5000"));