// kết nối mongodb bản chính thức
"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect.js");

const {
  db: { host, port, name, user, password },
} = require("../configs/config.mongodb.js");

const connectString =
  process.env.MONGODB_URI ||
  `mongodb://${user}:${password}@${host}:${port}/${name}?authSource=admin`;

console.log("connectString", connectString);

class Database {
  constructor() {
    this.connect();
  }

  // connect mongodb
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", {
        color: true,
        shell: true,
      });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // max number of connections in pool
        // Poolsize is the number of connections that are kept open in the pool
      })
      .then((_) => {
        console.log("MongoDB connected production type");
        countConnect();
      })
      .catch((err) => console.log(`Error connect: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Singleton instance
// This ensures that only one instance of the Database class is created
const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
