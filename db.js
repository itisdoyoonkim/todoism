const mongoose = require("mongoose");

mongoose.connect(require("./config"), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
