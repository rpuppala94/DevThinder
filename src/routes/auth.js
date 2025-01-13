const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    const encryptPassword = await bcrypt.hash(password, 10);
    console.log("hello", encryptPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptPassword,
    });

    await user.save();

    res.send("user saved successfully");
  } catch (error) {
    res
      .status(400)
      .send("connect error while the request from api" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("User credential failed, due to invalid user credential");
    }

    const match = await user.validatePassword(password);

    if (!match) {
      res
        .status(400)
        .send("User credential failed, due to invalid user credential");
    }

    const token = await user.getJWT();
    res.cookie("Token", token);
    res.send("User successfully logged in");
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("Token", null, {
    expires: new Date(Date.now()),
  });
  res.send();
});

module.exports = authRouter;
