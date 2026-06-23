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

/* ---------------- TRUST PROXY (IMPORTANT FOR RENDER) ---------------- */
app.set("trust proxy", 1);

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://url-shortener-kl3i.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // dev safe (no blocking)
    },
    credentials: true,
  })
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

app.use(limiter);

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(
    "mongodb+srv://pranciverma123_db_user:1ByDHWG3KxHyPP7n@cluster0.4locgwt.mongodb.net/?appName=Cluster0.qejgodr.mongodb.net/back?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* ---------------- ROUTES ---------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/user", userRoutes);
app.use("/url", urlRoutes);

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.status(200).send("Server Running");
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Started on Port ${PORT}`);
});