const { writeToClient } = require("../client");

module.exports = function process(toUserId, event) {
  writeToClient(toUserId, event.join("|"));
}
