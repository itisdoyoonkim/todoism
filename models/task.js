const mongoose = require("mongoose");
const validator = require("validator");

const TaskModel = mongoose.model("Task", {
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = TaskModel;
