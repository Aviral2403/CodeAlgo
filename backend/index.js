const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const questionRoute = require('./routes/questions');
const authRoutes = require("./routes/auth");
const submissionRoute = require("./routes/submissions");
const goalRoute = require("./routes/goal")
const codeRoute = require("./routes/code")


app.use('/api/questions', questionRoute);
app.use("/api/auth", authRoutes);
app.use("/api/submission", submissionRoute);
app.use("/api/goal", goalRoute)
app.use("/api/code",codeRoute)


// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});