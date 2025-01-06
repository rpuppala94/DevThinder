const express = require("express");
const { adminAuth } = require("./middleware/adminAuth");
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
    const user = new User(req.body);
    await user.save();
  } catch (error) {
    console.log("connect error while the request from api");
  }

  res.send("user saved successfully");
});

app.get("/user", async (req, res) => {
  try {
    const email = req.body.emailId;
    console.log(email);
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

    await User.findByIdAndUpdate({ _id: id }, data);

    res.send("User update successfully");
  } catch (error) {
    res.status(400).send("something went wrong");
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
