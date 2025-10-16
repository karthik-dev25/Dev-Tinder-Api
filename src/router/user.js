const express = require("express");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");
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
      return res.json({
        message: "Data fetched successfully!!",
        data: [],
      });
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
      return res.status(404).send("Connection requests not found!!");
    }

    res.json({
      message: "Data fetched successfully!!",
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    connectionRequest.forEach((user) => {
      hideUsers.add(user.fromUserId.toString());
      hideUsers.add(user.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE)
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Data fetched successfully",
      data: users,
      total: users.length,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter;
