"use strict";

const mongoose = require("mongoose");

const connectString =
  process.env.MONGODB_URI || "mongodb://192.168.1.88:27017/shopDEV";

mongoose
  .connect(connectString)
  .then((_) => console.log("MongoDB connected"))
  .catch((err) => console.log(`Error connect: ${err}`));

// dev
if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", {
    color: true,
    shell: true,
  });
}

module.exports = mongoose;
