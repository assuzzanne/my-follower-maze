const { writeToClient } = require("../client");
const { followRegistryInstance } = require("../singletons/followRegistryInstance");

module.exports = function process(toUserId, fromUserId, event) {
  followRegistryInstance.addFollowerToList(toUserId, fromUserId);
  writeToClient(toUserId, event.join("|"));
}
