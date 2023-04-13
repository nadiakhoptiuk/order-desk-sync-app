const path = require("path");
const fs = require("fs");

//   register file for writing system logs
const streamWriter = fs.createWriteStream(
  path.join(__dirname, "../systemLogs/orders.log"),
  {
    flags: "a",
  }
);

const streamReader = fs.createReadStream(
  path.join(__dirname, "../systemLogs/orders.log"),
  "utf-8"
);

//   finishing writing system logs
const finishWritingLogs = () => {
  streamWriter.end();

  streamWriter.on("finish", () => {
    console.log("Запис у потік завершено");
  });
};

module.exports = {
  streamReader,
  streamWriter,
  finishWritingLogs,
};
