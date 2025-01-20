const mongoose = require("mongoose");

const connectRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "`{VALUE}` is incorrect status type",
      },
    },
  },
  { timestamps: true }
);

connectRequestSchema.pre("save", function (next) {
  const connectReq = this;

  if (connectReq.fromUserId.equals(connectReq.toUserId)) {
    throw new Error("Cant send connection send request to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectRequestSchema);
