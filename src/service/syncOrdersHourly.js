const axios = require("axios");
const { registerLogStream } = require("./registerLogStream");

const syncOrdersHourly = () => {
  axios
    .get("https://app.orderdesk.me/api/v2/orders", {
      headers: {
        "ORDERDESK-STORE-ID": process.env.ORDERDESK_STORE_ID,
        "ORDERDESK-API-KEY": process.env.ORDERDESK_API_KEY,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      const { orders } = res.data;

      // Завершення запису у потік
      // registerLogStream.end();

      // Подія 'finish' спрацює після закінчення запису
      // registerLogStream.on("finish", () => {
      //   console.log("Запис у потік завершено");
      // });
      const newReport = {
        report_time: new Date().toLocaleString(),
        orders: [],
      };

      orders?.forEach((order) => {
        // console.log(order);
        const { id, shipping } = order;

        const newData = {
          order_id: id,
          shipping_address: shipping,
        };

        newReport.orders.push(newData);
        // date_added;
      });

      console.table(newReport);
      registerLogStream.write(`${JSON.stringify(newReport)}\n\n`);
    })
    .catch((err) => {
      const errorData = {
        report_time: new Date().toLocaleString(),
        error_message: err.message,
      };

      console.error("Error fetching orders from OrderDesk CRM:", err.message);
      registerLogStream.write(`${JSON.stringify(errorData)}+\n\n`);
    });
};

module.exports = { syncOrdersHourly };
