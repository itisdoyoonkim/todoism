const mongoose = require("mongoose");

mongoose.connect(require("../config/config"), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
