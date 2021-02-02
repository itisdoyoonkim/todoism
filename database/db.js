const mongoose = require("mongoose");

mongoose.connect(require("../config/config").mLab, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
