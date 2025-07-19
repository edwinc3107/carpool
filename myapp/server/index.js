const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const http = require("http")
const { Server } = require("socket.io")
const MessageModel = require('./models/Message')

const app = express();
const port = 4000;

const server = http.createServer(app);

// Middleware
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173', 
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" Database connected");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Routes
app.use('/', require('./routes/authRoutes'));

//Socket for server-client communication
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("test_message", (data) => {
    console.log("Received from client:", data);
  });

  //join chatroom
  socket.on("join_room", ({ roomId }) => {
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room: ${roomId}`);
});

socket.on("send_message", async ({ roomId, message, sender }) => {
      try {
      const msg = await MessageModel.create({
        ride: roomId,
        message,
        sender,
      });
      await msg.populate('sender'); 
      io.to(roomId).emit("receive_message", { message, sender, roomId, time: Date.now() });
    } catch (err) {
      console.error("Error saving message:", err);
    }
});


  socket.on("test-message", (data) => {
  console.log("Received test-message from client:", data);
});
  
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
