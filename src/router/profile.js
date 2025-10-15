const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const validator = require("validator");

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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    let loggedInUser = req.user;

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter a strong password");
    }

    const isPasswordValid = await loggedInUser.validatePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const passwordHash = await loggedInUser.passwordHash(newPassword);
    loggedInUser.password = passwordHash;

    
    await loggedInUser.save();
    
    res.send("Password updated successfully !!!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;