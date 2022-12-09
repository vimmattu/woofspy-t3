import { Server } from "socket.io";

console.log("Starting signaler...");

const io = new Server(8001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});
