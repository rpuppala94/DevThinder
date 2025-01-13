var jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { Token } = req.cookies;
    const decoded = await jwt.verify(Token, "ramupuppala");

    const { emailId } = decoded;
    const userDetails = await User.findOne({ emailId });

    if (!userDetails) {
      res.status(500).send("Invalid Cookies please try again");
    }

    req.user = userDetails;
    next();
  } catch (error) {
    res.status(500).send("Invalid Cookies please try again" + error.message);
  }
};

module.exports = {
  adminAuth,
};
