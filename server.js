const app = require("./src/app");

const {
  app: { port },
} = require("./src/configs/config.mongodb.js");

const PORT = port || process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
