const express = require("express");

const User = require("../models/user");
const { adminAuth } = require("../middleware/adminAuth");
const { validDataProfile } = require("../utills/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", adminAuth, async (req, res) => {
  try {
    const userDetails = await User.find({});

    res.send(userDetails);
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }
});

profileRouter.patch("/profile/edit", adminAuth, async (req, res) => {
  try {
    if (!validDataProfile(req)) {
      res.status(400).send("Please enter the valid field only");
    }

    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();

    res.send("suucessfully updated");
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }
});

module.exports = profileRouter;
