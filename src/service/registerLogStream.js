const path = require("path");
const fs = require("fs");

//   register file for writing system logs
const logStream = fs.createWriteStream(
  path.join(__dirname, "../systemLogs/orders.log"),
  {
    flags: "a",
  }
);

//   finishing writing system logs
const finishWritingLogs = () => {
  logStream.end();

  logStream.on("finish", () => {
    console.log("Запис у потік завершено");
  });
};

module.exports = {
  logStream,
  finishWritingLogs,
};
