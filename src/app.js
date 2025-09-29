const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObject = {
    firstName: "Karthik",
    lastName: "N",
    emailId: "karthik123@gmail.com",
    password: "karthik@0388",
  };

  const user = new User(userObject);

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error saving user:", error.message);
  }
});

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
