const { followRegistryInstance } = require("../singletons/followRegistryInstance");

module.exports = function process(toUserId, fromUserId) {
  followRegistryInstance.removeFollowerFromList(toUserId, fromUserId);
}