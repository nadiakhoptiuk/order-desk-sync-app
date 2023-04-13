/* eslint-disable camelcase */
// const axios = require("axios");
// const { axiosErrorHandler } = require("./axiosErrorHandler");
const { convertToMs } = require("./convertToMs");
const { queryToOpenDesk } = require("./query");
// const { logStream, finishWritingLogs } = require("./registerLogStream");

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

  // axios
  //   .get(
  //     `https://app.orderdesk.me/api/v2/orders?folder_id=320309&search_start_date=${startIntervalByStr}&search_end_date=${reportUTCDateByStr}&order_by=date_added&limit=500`,
  //     {
  //       headers: {
  //         "ORDERDESK-STORE-ID": process.env.ORDERDESK_STORE_ID,
  //         "ORDERDESK-API-KEY": process.env.ORDERDESK_API_KEY,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //   .then((res) => {
  //     const { orders } = res.data;

  //     //  report data creating
  //     const newReport = {
  //       report_time_locale: reportDate.toString(),
  //       report_time_utc: reportDate.toUTCString(),
  //       interval: `within the last ${intervalInMin} minutes`,
  //       orders: [],
  //     };

  //     orders?.forEach((order) => {
  //       const { id, shipping } = order;

  //       const newData = {
  //         order_id: id,
  //         shipping_address: shipping,
  //         date_added_by_locale: new Date(order.date_added).toString(),
  //         date_added_by_utc: order.date_added,
  //       };

  //       newReport.orders.push(newData);
  //     });

  //     console.log(newReport);

  //     // write report to system logs
  //     logStream.write(`${JSON.stringify(newReport)}\n\n`);
  //   })
  //   .catch((err) => {
  //     const errorData = {
  //       report_time: new Date().toLocaleString(),
  //       error: axiosErrorHandler(err),
  //     };

  //     console.log({ Error: errorData.error });
  //     logStream.write(`${JSON.stringify(errorData)}\n\n`);

  //     //   finishing writing system logs
  //     finishWritingLogs();
  //     process.exit(1);
  //   });
};

module.exports = { syncOrdersByInterval };
