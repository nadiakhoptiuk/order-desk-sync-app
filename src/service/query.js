const axios = require("axios");
const { axiosErrorHandler } = require("../utils/axiosErrorHandler");
const {
  streamWriter,
  finishWritingLogs,
  streamReader,
} = require("./registerLogStream");
const dotenv = require("dotenv");
const { convertObjectToString } = require("../utils/convertObjectToString");

dotenv.config();

const axiosInstance = axios.create({
  baseURL: "https://app.orderdesk.me/api/v2/orders",
  headers: {
    "Content-Type": "application/json",
    "ORDERDESK-STORE-ID": process.env.ORDERDESK_STORE_ID,
    "ORDERDESK-API-KEY": process.env.ORDERDESK_API_KEY,
  },
});

// create get query to Open Desk API, where headers are gotten from env for authentication and different variables are used in query params of endpoint
const queryToOpenDesk = (
  startOfInterval,
  endOfInterval,
  reportDate,
  intervalInMin
) => {
  axiosInstance
    .get("", {
      params: {
        folder_id: 320309,
        search_start_date: startOfInterval,
        search_end_date: endOfInterval,
        order_by: "date_added",
        limit: 500,
      },
    })
    .then((res) => {
      const { orders } = res.data;

      const reportTimeLocale = reportDate.toString();
      const reportTimeUtc = reportDate.toUTCString();

      let existedData = "";

      streamWriter.write(
        `\nReport within the last ${intervalInMin} minutes\nREPORT TIME:\nlocale:\t${reportTimeLocale}\nUTC:\t${reportTimeUtc}\nNEW ORDERS:\n`
      );

      streamReader.on("data", (chunk) => {
        // Обробка отриманих даних
        existedData = chunk;
      });

      // Checking new ids for duplicates
      streamReader.on("end", () => {
        if (orders.length === 0) {
          streamWriter.write(`There are no new orders\n`);
        }

        orders?.forEach((order) => {
          const { id, shipping } = order;

          if (existedData.includes(id)) {
            return;
          }

          const shippingString = convertObjectToString(shipping);

          // write report to system logs
          streamWriter.write(
            `- Order ID \t ${id}\t Shipping address:\t${shippingString}\n`
          );
        });
      });
    })
    .catch((err) => {
      const reportTimeLocale = reportDate.toString();
      const reportTimeUtc = reportDate.toUTCString();

      const errorMessage = axiosErrorHandler(err);

      streamWriter.write(
        `\nReport within the last ${intervalInMin} minutes\nREPORT TIME:\nlocale:\t${reportTimeLocale}\nUTC:\t${reportTimeUtc}\nERROR:\n${errorMessage}\n`
      );

      console.log(err.message);

      //   finishing writing system logs
      finishWritingLogs();
      process.exit(1);
    });
};

module.exports = {
  queryToOpenDesk,
};
