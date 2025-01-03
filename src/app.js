const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("hello for users");
});

app.use("/", (req, res) => {
  console.log("successfully ");
  res.send("hello world");
});

app.listen("7777");
