var jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    const decoded = await jwt.verify(Token, "ramupuppala");

    const { emailId } = decoded;
    // const userDetails = await User.find({ emailId });
    const userDetails = User.getUser(emailId);
    console.log(userDetails);
    if (userDetails.length === 0) {
      res.status(500).send("Invalid Cookies please try again");
    }
    next();
  } catch (error) {
    res.status(500).send("Invalid Cookies please try again");
  }
};

module.exports = {
  adminAuth,
};
