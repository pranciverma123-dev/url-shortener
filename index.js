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

mongoose
  .connect(
    "mongodb+srv://pranciverma123_db_user:Jac8NQKOJ1rtVmEQ@cluster0.qejgodr.mongodb.net/back?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});



app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://url-shortener-yijl-ie3mbpacr-pranciverma123-devs-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/user", userRoutes);
app.use("/url", urlRoutes);



app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
