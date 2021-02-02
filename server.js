const express = require("express");
const app = express();
require("./database/db");

const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

app.use(express.json());
app.use("/users", userRoute);
app.use("/tasks", taskRoute);

module.exports = app;
