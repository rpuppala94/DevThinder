const express = require("express");

const { adminAuth } = require("../middleware/adminAuth");
const connectRequest = require("../models/connectRequest");
const User = require("../models/user");

const userRoute = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "skills", "photoUrl"];

userRoute.get("/user/request/received", adminAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionReq = await connectRequest.find({
      $or: [
        {
          toUserId: loggedUser._id,
          status: "accepted",
        },
      ].populate("fromUserId", USER_SAFE_DATA),
    });

    res.json({
      message: "Data fetch successfully",
      data: connectionReq,
    });
  } catch (error) {}
});

userRoute.get("/user/connections", adminAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionReq = await connectRequest.find({
      $or: [
        {
          toUserId: loggedUser._id,
          status: "accepted",
        },
      ]
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA),
    });

    const data = connectionReq.map((row) => {
      if (row.formUserId._id.toString() === loggedUser._id) {
        return row.toUserId();
      }
      return row.formUserId;
    });

    res.send({
      data,
    });
  } catch (error) {}
});

userRoute.get("/feed", adminAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const connectionReq = await connectRequest
      .find({
        $or: [{ formUserId: loggedUser._id }, { toUserId: loggedUser._id }],
      })
      .select("formUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionReq.map((res) => {
      hideUserFromFeed.add(res.formUserId?.toString());
      hideUserFromFeed.add(res.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUserFromFeed),
          },
          _id: {
            $ne: loggedUser._id,
          },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (error) {
    res.status(400).send("Soemthing wrong " + error);
  }
});

module.exports = userRoute;
