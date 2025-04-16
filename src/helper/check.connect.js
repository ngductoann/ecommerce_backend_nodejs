"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

// count number of connections
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections to MongoDB: ${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;

    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections on number osf cores
    const maxConnections = numCore * 5;

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(
        `Overload: ${numConnection} connections, max: ${maxConnections}`,
      );
    }
  }, _SECOND); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverLoad };
