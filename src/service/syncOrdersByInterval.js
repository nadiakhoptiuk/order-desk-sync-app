const { convertToMs } = require("../utils/convertToMs");
const { queryToOpenDesk } = require("./query");

const syncOrdersByInterval = () => {
  // For convenience in this app user has ability to change interval for synchronization at environment variables
  const intervalInMin = process.env.INTERVAL_IN_MINUTES || 60;

  // convert interval to ms and add 1 minute to avoid inaccuracies of setTimeOut function
  const intervalInMs = convertToMs(Number(intervalInMin) + 1);

  // these variables are used for system logs and for query params as search_end_date
  const reportDate = new Date();
  const reportUTCDateByStr = reportDate.toUTCString();

  // these variables are used for query params as search_start_date
  const startInterval = reportDate.getTime() - intervalInMs;
  const startIntervalByStr = new Date(startInterval).toUTCString();

  // create get query to Open Desk API, where headers are gotten from env for authentication and different variables are used in query params of endpoint
  queryToOpenDesk(
    startIntervalByStr,
    reportUTCDateByStr,
    reportDate,
    intervalInMin
  );
};

module.exports = { syncOrdersByInterval };
