const mongoose = require("mongoose");
const validator = require("validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getUser = async function (emailId) {
  const user = this;

  const userDetails = await user.find({ emailId });

  return userDetails;
};

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ emailId: user[0].emailId }, "ramupuppala", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;

  const match = await bcrypt.compare(password, user.password);

  return match;
};

module.exports = mongoose.model("User", userSchema);
