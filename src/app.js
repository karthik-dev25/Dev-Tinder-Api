const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

const app = express();

// Data parsers
app.use(express.json());
app.use(cookieParser());

//Express Router
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is Running Successfully on Port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database connection not established....");
  });
