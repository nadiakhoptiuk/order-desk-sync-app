const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cors = require("cors");
const { syncOrdersHourly } = require("./service/syncOrdersHourly");
const { registerLogStream } = require("./service/registerLogStream");
const errorHandler = require("./middlewares/errorsHandler");

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.use(logger("combined", { stream: registerLogStream }));

syncOrdersHourly();
setInterval(syncOrdersHourly, 60000);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = {
  app,
};
