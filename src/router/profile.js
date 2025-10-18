const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const validator = require("validator");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    let user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    if(!validateProfileEditData(req)){
      throw new Error("Invalid Edit Request")
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = req.body[key])
    );

    await loggedInUser.save();

    res.json({message:"User updated Successfully",data:loggedInUser});
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/forgot/password", async (req, res) => {
  try {
    const {emailId, newPassword , confirmPassword } = req.body;

    if(newPassword.toString() !== confirmPassword.toString()){
      throw new Error("Password mismatch !!");
    }

    const loggedInUser = await User.findOne({emailId:emailId});

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter a strong password");
    }

    //const isPasswordValid = await loggedInUser.validatePassword(currentPassword);

    if (!loggedInUser) {
      throw new Error("Invalid Credentials");
    }

    const passwordHash = await loggedInUser.passwordHash(newPassword);
    loggedInUser.password = passwordHash;

    
    await loggedInUser.save();
    
    res.send("Password Reset successful!!!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;