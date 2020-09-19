const { followRegistryInstance } = require("../eventDispatcher");
const { writeToClient } = require("../client");

function process(toUserId, fromUserId, event) {
  followRegistryInstance.addFollowerToList(toUserId, fromUserId);
  writeToClient(toUserId, event.join("|"));
};

exports.process = process;
