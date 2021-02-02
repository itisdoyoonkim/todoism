const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const auth = require("../middleware/auth");

// SIGN UP
router.post("/", async (req, res) => {
  const newUser = new User(req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    newUser.password = hashedPassword;

    await newUser.save();

    const authToken = generateAuthToken(newUser._id);

    res.status(201).json({ msg: "New user created.", authToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

// EDIT USER INFO
router.patch("/me", auth, async (req, res) => {
  const attemptedUpdateFields = Object.keys(req.body);
  const allowedUpdatableFields = ["name", "email"];

  const updateIsAllowed = attemptedUpdateFields.every((field) => {
    return allowedUpdatableFields.includes(field);
  });

  if (!updateIsAllowed) {
    return res.status(400).json({
      msg: "Attempted to update a field that you are not allowed to update.",
    });
  }

  try {
    attemptedUpdateFields.forEach((field) => {
      return (req.user[field] = req.body[field]);
    });

    await req.user.save();

    // remove password from user info.
    const userToModify = req.user.toObject();
    delete userToModify.password;

    res.status(200).json({ user: userToModify });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

// DELETE A USER
router.delete("/me", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        msg: "Email not found.",
      });
    }

    console.log(user);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    console.log("isMatch", isMatch);

    if (!isMatch) {
      return res.status(401).json({ msg: "Unable to login." });
    }

    // send jwt
    const authToken = generateAuthToken(user._id);

    // remove password from user info.
    const userToModify = user.toObject();
    delete userToModify.password;

    res.status(200).json({ user: userToModify, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

router.get("/me", auth, async (req, res) => {
  res.status(200).json(req.user);
});

// utility functions
const generateAuthToken = (userId) => {
  return jwt.sign({ _id: userId }, jwtSecret, {
    expiresIn: "1 week",
  });
};

module.exports = router;
