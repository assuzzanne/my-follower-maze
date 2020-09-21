const { followRegistryInstance } = require("../singletons/followRegistryInstance");
const { writeToClient } = require("../client");

module.exports = function process(fromUserId, event) {
    const followers = followRegistryInstance.getUserFollowersList(
        fromUserId
      );
      followers.forEach((follower) => {
        writeToClient(follower, event.join("|"));
      });
    
};
