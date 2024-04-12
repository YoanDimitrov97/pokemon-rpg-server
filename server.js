import express from "express";
import { Server } from "socket.io";
const app = express();
// import { characters } from "./characters.js";
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

function generateRoomId() {
  return Math.random().toString(36).substr(2, 6); // Example implementation
}
  const rooms = {};
io.on("connection", (socket) => {

  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });

  // Handle room creation/joining events
  socket.on("createRoom", (playerName, callback) => {
    const roomId = generateRoomId();
    rooms[roomId] = [{ id: socket.id, username: playerName }];

    socket.join(roomId);
    console.log("Created room with id", roomId, rooms);
    callback( {roomId: roomId });
  });

  // Handle room joining
  socket.on("joinRoom", (roomId, playerName, callback) => {
    console.log("Joining list of rooms", rooms);
    //if there is not user in the room, create it
    if (!rooms[roomId] || rooms[roomId].length >= 3) {
      console.log("Room doesn't exist or is full");
      callback("Room is full or does not exist");
      return;
    }

    socket.join(roomId);
    rooms[roomId].push({id: socket.id, username:playerName});
    console.log(`${socket.id} joined room ${roomId}`);
    console.log(rooms);
    // Emit events and callback
    callback("User joined room");
    io.emit("playerJoined", { players: rooms[roomId] });
  });
});
