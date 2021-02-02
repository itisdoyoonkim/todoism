const router = require("express").Router();
const Task = require("../models/task");

router.post("/", async (req, res) => {
  const newTask = new Task(req.body);

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ msg: "An error has occurred." });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

router.get("/:task_id", async (req, res) => {
  const taskId = req.params.task_id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found." });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

router.patch("/:task_id", async (req, res) => {
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
    const updatedTask = await Task.findById(taskId);

    attemptedUpdateFields.forEach((field) => {
      return (task[field] = req.body[field]);
    });

    await task.save();

    if (!updatedTask) {
      return res.status(404).json({
        msg: "Task not found.",
      });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

router.delete("/:task_id", async (req, res) => {
  const taskId = req.params.task_id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

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
