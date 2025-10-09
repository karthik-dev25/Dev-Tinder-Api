const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: String,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "Invalid status type: {VALUE}",
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({
  fromUserId: 1,
  toUserId: 1,
});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest?.fromUserId === connectionRequest.toUserId) {
    throw new Error("Connection request cannot sent to yourself");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequests",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
