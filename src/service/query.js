const axios = require("axios");
const { axiosErrorHandler } = require("../utils/axiosErrorHandler");
const {
  streamWriter,
  finishWritingLogs,
  readOrders,
} = require("./registeWriterAndReader");
const dotenv = require("dotenv");
const { convertObjectToString } = require("../utils/convertObjectToString");
const { cutData } = require("../utils/cutReadData");

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
const queryToOpenDesk = async (
  startOfInterval,
  endOfInterval,
  reportDate,
  intervalInMin
) => {
  try {
    const res = await axiosInstance.get("", {
      params: {
        folder_id: 320309,
        search_start_date: startOfInterval,
        search_end_date: endOfInterval,
        order_by: "date_added",
        limit: 500,
      },
    });

    const { orders } = res.data;
    const reportTimeLocale = reportDate.toString();

    streamWriter.write(
      `\nREPORT TIME (locale):\t${reportTimeLocale}\nNEW ORDERS within the last ${intervalInMin} minutes:\n`
    );

    // check if there are new orders in CRM per interval
    if (orders.length === 0) {
      streamWriter.write(`There are no new orders\n`);
      return;
    }

    // read and return the last report from system logs
    const existedData = await readOrders();
    const reducedData = cutData(existedData);

    orders?.forEach((order) => {
      const { id, shipping } = order;

      // Checking new ids for duplicates with ids from the last report from system logs
      if (reducedData.includes(id)) {
        return;
      }

      const shippingString = convertObjectToString(shipping);

      // write report to system logs
      streamWriter.write(
        `- Order ID \t ${id}\t Shipping address:\t${shippingString}\n`
      );
    });
  } catch (err) {
    const reportTimeLocale = reportDate.toString();
    const { message, error } = axiosErrorHandler(err);

    // write report to system logs
    streamWriter.write(
      `\nERROR TIME (locale):\t${reportTimeLocale}\nERROR:\n${message}\n`
    );
    console.log(error);

    //   finishing writing system logs
    finishWritingLogs();
    process.exit(1);
  }
};

module.exports = {
  queryToOpenDesk,
};
