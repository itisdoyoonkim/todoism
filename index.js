const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
require("./database/db");

const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

app.use(express.json());
app.use("/users", userRoute);
app.use("/tasks", taskRoute);

app.listen(PORT, () => {
  console.log(`EXPRESS SERVER PORT: ${PORT}`);
});
