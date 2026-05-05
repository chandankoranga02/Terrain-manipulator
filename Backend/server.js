// ================= SETUP =================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// ================= STATE =================
let robotState = {
  move: "stop",     // forward, backward
  turn: "none",     // left, right
  speed: 0,         // 0–255
  gripper: "stop",  // open, close
  gripSpeed: 0,
  updatedAt: Date.now()
};

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Frontend se control data
  socket.on("control", (data) => {
    // merge state safely
    robotState = {
      ...robotState,
      ...data,
      updatedAt: Date.now()
    };

    // sabko latest state bhejo (ESP32 included)
    io.emit("state", robotState);
  });

  // agar koi latest state maange
  socket.on("getState", () => {
    socket.emit("state", robotState);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ================= FAIL-SAFE =================
// agar 500ms tak update nahi → STOP
setInterval(() => {
  const now = Date.now();

  if (now - robotState.updatedAt > 500) {
    robotState.move = "stop";
    robotState.turn = "none";
    robotState.speed = 0;

    io.emit("state", robotState);
  }
}, 100);

// ================= HTTP ROUTES =================
app.get("/", (req, res) => {
  res.send("🚀 Robot Backend Running");
});

// debugging ke liye
app.get("/state", (req, res) => {
  res.json(robotState);
});

// ================= START SERVER =================
const PORT = 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on http://192.168.x.x:${PORT}`);
});