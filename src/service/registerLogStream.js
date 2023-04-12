const path = require("path");
const fs = require("fs");

const registerLogStream = fs.createWriteStream(
  path.join(__dirname, "orders.log"),
  {
    flags: "a",
  }
);

module.exports = {
  registerLogStream,
};
