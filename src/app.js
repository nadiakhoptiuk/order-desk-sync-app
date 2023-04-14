const dotenv = require("dotenv");
const { syncOrdersByInterval } = require("./service/syncOrdersByInterval");
const { convertToMs } = require("./utils/convertToMs");

dotenv.config();

// For convenience in this app user has ability to change interval for synchronization at environment variables
const intervalInMins = process.env.INTERVAL_IN_MINUTES || 60;

// main functionality for synchronization
syncOrdersByInterval();
setInterval(syncOrdersByInterval, convertToMs(intervalInMins));
