const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

// Data parsers
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    //create a new instance in DB
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Signed Successfully");
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("Login Successful!!!");
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    let user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send("Connection request sent!!");
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
