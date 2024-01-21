import express from "express";
import cors from 'cors'
import { Server } from "socket.io";
const app = express();
import { characters } from "./characters.js";

app.use(cors())
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/characters", (req, res) => {
  res.json(characters);
});

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5173", "http://127.0.0.1:5500"],
  },
});


//localhost:3000/characters get all characters
app.get('/characters', (req, res) => {
  res.json(characters);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  //server received a message
  socket.on("send_message", (data) => {
    //socket.broadcast.emit("receive_message", socket.id);
  });
});
