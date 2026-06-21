require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const userRoutes = require("./routes/user");
const urlRoutes = require("./routes/url");

const app = express();

// MongoDB Connection

mongoose
  .connect("mongodb://127.0.0.1:27017/back")
  .then(() =>
    console.log("MongoDB Connected")
  )
  .catch((err) =>
    console.log(err)
  );

// Rate Limiter

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    message:
      "Too many requests, please try again later",
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());

app.use(limiter);

// Swagger

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Routes

app.use("/user", userRoutes);

app.use("/url", urlRoutes);

// Home Route

app.get("/", (req, res) => {
  res.send("Server Running");
});

// Server

app.listen(8000, () => {
  console.log(
    "Server Started on Port 8000"
  );
});
