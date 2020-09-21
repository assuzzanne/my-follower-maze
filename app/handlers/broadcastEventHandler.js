const { clientPoolInstance } = require("../singletons/clientPoolInstance");
const { writeToClient } = require("../client");

module.exports = function process(event) {
  const clientPool = clientPoolInstance.get();
  for (let toUserId in clientPool) {
    writeToClient(toUserId, event.join("|"));
  }
};
