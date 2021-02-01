const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("./db");

const User = require("./models/user");
const Task = require("./models/task");

app.use(express.json());

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.save();
    res.status(201).json({ msg: "New user created." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error has occurred." });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.get("/users/:user_id", async (req, res) => {
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

app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ msg: "An error has occurred." });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error has occurred." });
  }
});

app.get("/tasks/:task_id", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`EXPRESS SERVER PORT: ${PORT}`);
});
