const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const filePath = path.join(__dirname, "../systemLogs/orders.log");

//   register file for writing system logs
const streamWriter = fs.createWriteStream(filePath, {
  flags: "a",
});

//   finishing writing system logs
const finishWritingLogs = () => {
  streamWriter.end();

  streamWriter.on("finish", () => {
    console.log("Writing completed");
  });
};

// function for reading reports from system logs
const readOrders = async () => {
  const existedData = await fsPromises.readFile(filePath, "utf-8");

  return existedData;
};

module.exports = {
  readOrders,
  streamWriter,
  finishWritingLogs,
};
