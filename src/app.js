const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./middlewares/errorsHandler");
const { syncOrdersByInterval } = require("./service/syncOrdersByInterval");
const { convertToMs } = require("./utils/convertToMs");
const { streamWriter } = require("./service/registerLogStream");

const app = express();

dotenv.config();

// For convenience in this app user has ability to change interval for synchronization at environment variables
const intervalInMins = process.env.INTERVAL_IN_MINUTES || 60;

app.use(express.json());
app.use(cors());

// set up logger for write system logs to a particular file
app.use(logger("combined", { stream: streamWriter }));

// main functionality for synchronization
syncOrdersByInterval();
setInterval(syncOrdersByInterval, convertToMs(intervalInMins));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = {
  app,
};
