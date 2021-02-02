const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const User = require("../models/user");

const auth = async (req, res, next) => {
  console.log("auth middleware running.", req.header("Authorization"));
  try {
    const authToken = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(authToken, jwtSecret);

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }

    req.user = user;

    console.log("Logged in user: ", req.user);

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Please log in." });
  }
};

module.exports = auth;
