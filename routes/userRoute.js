const router = require("express").Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(201).json({ msg: "New user created." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "An error has occurred" });
  }
});

router.patch("/:user_id", async (req, res) => {
  const attemptedUpdateFields = Object.keys(req.body);
  const allowedUpdatableFields = ["name", "email", "password", "age"];

  const updateIsAllowed = attemptedUpdateFields.every((field) => {
    return allowedUpdatableFields.includes(field);
  });

  if (!updateIsAllowed) {
    return res.status(400).json({
      msg: "Attempted to update a field that you are not allowed to update.",
    });
  }

  const userId = req.params.user_id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

router.delete("/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: "No user found to delete." });
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

module.exports = router;
