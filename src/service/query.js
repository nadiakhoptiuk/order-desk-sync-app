const axios = require("axios");
const { axiosErrorHandler } = require("./axiosErrorHandler");
const { logStream, finishWritingLogs } = require("./registerLogStream");

// create get query to Open Desk API, where headers are gotten from env for authentication and different variables are used in query params of endpoint
const queryToOpenDesk = (
  startOfInterval,
  endOfInterval,
  reportDate,
  intervalInMin
) => {
  axios
    .get(
      `https://app.orderdesk.me/api/v2/orders?folder_id=320309&search_start_date=${startOfInterval}&search_end_date=${endOfInterval}&order_by=date_added&limit=500`,
      {
        headers: {
          "ORDERDESK-STORE-ID": process.env.ORDERDESK_STORE_ID,
          "ORDERDESK-API-KEY": process.env.ORDERDESK_API_KEY,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      const { orders } = res.data;

      //  report data creating
      const newReport = {
        report_time_locale: reportDate.toString(),
        report_time_utc: reportDate.toUTCString(),
        interval: `within the last ${intervalInMin} minutes`,
        orders: [],
      };

      orders?.forEach((order) => {
        const { id, shipping } = order;

        const newData = {
          order_id: id,
          shipping_address: shipping,
          date_added_by_locale: new Date(order.date_added).toString(),
          date_added_by_utc: order.date_added,
        };

        newReport.orders.push(newData);
      });

      console.log(newReport);

      // write report to system logs
      logStream.write(`${JSON.stringify(newReport)}\n\n`);
    })
    .catch((err) => {
      const errorData = {
        report_time: new Date().toLocaleString(),
        error: axiosErrorHandler(err),
      };

      console.log({ Error: errorData.error });
      logStream.write(`${JSON.stringify(errorData)}\n\n`);

      //   finishing writing system logs
      finishWritingLogs();
      process.exit(1);
    });
};

module.exports = {
  queryToOpenDesk,
};
