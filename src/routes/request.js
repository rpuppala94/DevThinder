const express = require("express");

const User = require("../models/user");
const { adminAuth } = require("../middleware/adminAuth");

const requestRouter = express.Router();

requestRouter.get("/request", adminAuth, async (req, res) => {
  try {
    const userDetails = await User.find({});

    res.send(userDetails);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

module.exports = requestRouter;
