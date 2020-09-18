const { clientPoolInstance, writeToClient } = require("./client");

// const followEventHandler = require("./handlers/followEventHandler");
// const unfollowEventHandler = require("./handlers/unfollowEventHandler");
// const privateMessageEventHandler = require("./handlers/privateMessageEventHandler");
// const broadcastEventHandler = require("./handlers/broadcastEventHandler");
// const statusUpdateEventHandler = require("./handlers/statusUpdateEventHandler");

const followRegistry = new Map();
const followRegistryInstance = {
  addFollowerToList: (toUserId, fromUserId) => {
    if (followRegistry.has(toUserId)) {
      const followersList = followRegistry.get(toUserId);
      followersList.add(fromUserId);
    } else {
      const followersList = new Set([]);
      followRegistry.set(toUserId, followersList.add(fromUserId));
    }
  },
  removeFollowerFromList: (toUserId, fromUserId) => {
    if (followRegistry.has(toUserId)) {
      const followersList = followRegistry.get(toUserId);
      followersList.delete(fromUserId);
    }
  },
  getUserFollowersList: (fromUserId) => {
    followRegistry.get(fromUserId);
  },
};
Object.freeze(followRegistryInstance);

function processEvent(event) {
  const eventData = event.split("|");
  const eventType = eventData[1];

  const fromUserId = parseInt(eventData[2]);
  const toUserId = parseInt(eventData[3]);

  switch (eventType) {
    case "F":
      // Follow
      {
        followRegistryInstance.addFollowerToList(toUserId, fromUserId);
        writeToClient(toUserId, event);
      }
      break;

    case "U":
      // Unfollow
      {
        followRegistryInstance.removeFollowerFromList(toUserId, fromUserId);
      }
      break;

    case "P":
      // Private Msg
      {
        writeToClient(toUserId, event);
      }
      break;

    case "B":
      // Brodcast
      {
        const clientPool = clientPoolInstance.get();

        for (let userId in clientPool) {
          writeToClient(userId, event);
        }
      }
      break;

    case "S":
      // Status Update
      {
        const followers = followRegistryInstance.getUserFollowersList(
          fromUserId
        );
        if (!followers) return;
          followers.forEach((follower) => {
            writeToClient(follower, event);
          });
      }
      break;

    default:
      {
        console.error(`Failed to process event ${event}!`);
      }
      break;
  }
}

exports.followRegistryInstance = followRegistryInstance;
exports.processEvent = processEvent;
exports.writeToClient = writeToClient;
