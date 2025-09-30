const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    let ALLOW_FIELDS_UPDATE = [
      "age",
      "gender",
      "photoUrl",
      "skills",
      "about",
      "password",
    ];
    let isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOW_FIELDS_UPDATE.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error(
        "Update is not allowed, Please add only the respective fields"
      );
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
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
