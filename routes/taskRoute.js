const router = require("express").Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

// PRIVATE
router.post("/", auth, async (req, res) => {
  const newTask = new Task({
    ...req.body,
    creator: req.user._id,
  });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ msg: "An error has occurred." });
  }
});

// PRIVATE
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ creator: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

// PRIVATE
router.get("/:task_id", auth, async (req, res) => {
  const taskId = req.params.task_id;
  try {
    const task = await Task.findOne({
      _id: taskId,
      creator: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ msg: "Task not found." });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

// PRIVATE
router.patch("/:task_id", auth, async (req, res) => {
  const attemptedUpdateFields = Object.keys(req.body);
  const allowedUpdatableFields = ["description", "completed"];

  const updateIsAllowed = attemptedUpdateFields.every((each) => {
    return allowedUpdatableFields.includes(each);
  });

  if (!updateIsAllowed) {
    return res.status(400).json({
      msg: "Attempted to update a field that you are not allowed to update.",
    });
  }

  const taskId = req.params.task_id;

  try {
    const updatedTask = await Task.findOne({
      _id: taskId,
      creator: req.user._id,
    });

    if (!updatedTask) {
      return res.status(404).json({
        msg: "Task not found.",
      });
    }

    attemptedUpdateFields.forEach((field) => {
      return (updatedTask[field] = req.body[field]);
    });

    await updatedTask.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

// PRIVATE
router.delete("/:task_id", auth, async (req, res) => {
  const taskId = req.params.task_id;

  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      creator: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ msg: "No task found to delete." });
    }

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

module.exports = router;
