const express = require("express");
const cookieParser = require("cookie-parser");

const connectDb = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRoute = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRoute);

connectDb()
  .then(() => {
    console.log("Successfully logged in db connection");

    app.listen("7777", () => {
      console.log("Successfully connected to the server");
    });
  })
  .catch((error) => console.log("failed the db connection"));
