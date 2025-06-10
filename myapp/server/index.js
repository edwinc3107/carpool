const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const app = express();
const port = 4000;

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
