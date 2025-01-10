const express = require("express");
const bcrypt = require("bcrypt");
const cookieParse = require("cookie-parser");

const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();

// day 1
// --------------------------------
// app.get("/user", (req, res) => {
//   res.send("hello for users");
// });

// app.get("/user/:userId", (req, res) => {
//   console.log(req.params);
//   res.send("hello for users");
// });

// app.use("/", (req, res) => {
//   console.log("successfully ");
//   res.send("hello world");
// });

// ---------------------------------

// day 2

// app.use("/user", adminAuth, (req, res) => {
//   res.send("user successfully logged in");
// });

// -------------------------------

// day 3

// app.post("/signUp", async (req, res) => {
// const userObj = {
//   firstName: "Jaswin",
//   lastName: "Puppala",
//   emailId: "jashwin@gmail.com",
//   age: 1,
//   password: "jashwin",
//   gender: "male",
// };

// const user = new User(userObj);
// await user.save();
// res.send("user saved successfully");
// });

// ----------------------------
// day 3

app.use(express.json());

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
    const user = await User.find({ emailId });

    if (user.length == 0) {
      throw new Error("User credential failed, due to invalid user credential");
    }

    const match = await bcrypt.compare(password, user[0].password);

    if (match) {
      res.cookie("Token", "klsjdflksjdflkjslkdfjsdlkjdf");
      res.send("User successfully logged in");
    }

    res.send("User credential failed, due to invalid user credential");
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});
