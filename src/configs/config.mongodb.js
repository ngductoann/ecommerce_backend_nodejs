"use strict";

// level 0
// const config = {
//   app: {
//     port: process.env.PORT || 3000,
//   },
//
//   db: {
//     host: "192.168.1.88",
//     port: 27017,
//     name: "db",
//   },
// };

// level 1
// const dev = {
//   app: {
//     port: process.env.PORT || 3000,
//   },
//
//   db: {
//     host: "192.168.1.88",
//     port: 27017,
//     name: "dbDev",
//   },
// };
//
// const pro = {
//   app: {
//     port: process.env.PORT || 3000,
//   },
//
//   db: {
//     host: "192.168.1.88",
//     port: 27017,
//     name: "dbProduct",
//   },
// };
//

// level 2
const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },

  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
    user: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },

  db: {
    host: process.env.PRO_DB_HOST,
    port: process.env.PRO_DB_PORT,
    name: process.env.PRO_DB_NAME,
    user: process.env.PRO_DB_USER,
    password: process.env.PRO_DB_PASSWORD,
  },
};

const config = { dev, pro };

const env = process.env.NODE_ENV || "dev"; // default is dev

module.exports = config[env];
