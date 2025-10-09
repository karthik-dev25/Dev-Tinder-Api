const express = require("express");
const ConnectionRequests = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

const USER_SAFE = "firstName lastName age gender about skills photoUrl";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", USER_SAFE)
      .populate("toUserId", USER_SAFE);
    if (!connectionRequest.length) {
      throw new Error("Connection requests not found!!");
    }

    res.json({
      message: "Data fetched successfully!!",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequests.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE)
      .populate("toUserId", USER_SAFE);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    if (!connectionRequest.length) {
      throw new Error("Connection requests not found!!");
    }

    res.json({
      message: "Data fetched successfully!!",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
