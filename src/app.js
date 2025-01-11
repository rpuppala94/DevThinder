const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/database");
const User = require("./models/user");

const { adminAuth } = require("./middleware/adminAuth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {
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

    // if (data?.skills && data?.skills.length > 5) {
    //   throw new Error(" Skills should have less than 5");
    // }

    await user.save();

    res.send("user saved successfully");
  } catch (error) {
    res
      .status(400)
      .send("connect error while the request from api" + error.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    const userDetails = await User.find({ emailId: email });
    res.send(userDetails);
  } catch (error) {
    res.status(400).send("something went wrong");
  }

  // res.send("user saved successfully");
});

app.get("/feed", async (req, res) => {
  try {
    const userDetails = await User.find({});

    res.send(userDetails);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const data = req.body;
    const id = req.body.id;

    if (data?.skills && data?.skills.length > 5) {
      throw new Error("Skills should have less than 5");
    }

    await User.findByIdAndUpdate({ _id: id }, data);

    res.send("User update successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const id = req.body.id;

    await User.deleteOne({ _id: id });

    res.send("User Delete successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

connectDb()
  .then(() => {
    console.log("Successfully logged in db connection");

    app.listen("7777", () => {
      console.log("Successfully connected to the server");
    });
  })
  .catch((error) => console.log("failed the db connection"));

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("User credential failed, due to invalid user credential");
    }

    const match = await user.validatePassword(password);

    if (match) {
      const token = user.getJWT();
      res.cookie("Token", token);
      res.send("User successfully logged in");
    }

    res.send("User credential failed, due to invalid user credential");
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});

app.get("/profile", adminAuth, async (req, res) => {
  try {
    const userDetails = await User.find({});

    res.send(userDetails);
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }

  // res.send("user saved successfully");
});
