const { clientPoolInstance, writeToClient } = require("./client");

const followEventHandler = require("./handlers/followEventHandler");
// const unfollowEventHandler = require("./handlers/unfollowEventHandler");
// const privateMessageEventHandler = require("./handlers/privateMessageEventHandler");
// const broadcastEventHandler = require("./handlers/broadcastEventHandler");
// const statusUpdateEventHandler = require("./handlers/statusUpdateEventHandler");

const followRegistry = {};
const followRegistryInstance = {
  addFollowerToList: (toUserId, fromUserId) => {
    const followers = followRegistry[toUserId];
    if (followers) {
      followers.add(fromUserId);
    } else {
      const followers = new Set([]);
      followers.add(fromUserId);
    }
  },
  removeFollowerFromList: (toUserId, fromUserId) => {
    const followers = followRegistry[toUserId];
    if (followers) {
      followers.delete(fromUserId);
    } else {
      followRegistry[toUserId] = new Set([]);
    }
  },
  getUserFollowersList: (fromUserId) => {
    const followers = followRegistry[fromUserId];
    if (!followers) {
      return (followRegistry[fromUserId] = new Set([]));
    }
    return followers;
  },
};
Object.freeze(followRegistryInstance);

function processEvent(event) {
  const eventType = event[1];

  const fromUserId = parseInt(event[2], 10);
  const toUserId = parseInt(event[3], 10);

  switch (eventType) {
    case "F":
      {
        followRegistryInstance.addFollowerToList(toUserId, fromUserId);
        writeToClient(toUserId, event.join("|"));
        // followEventHandler.process(toUserId, fromUserId, event);

      }
      break;

    case "U":
      {
        followRegistryInstance.removeFollowerFromList(toUserId, fromUserId);
      }
      break;

    case "P":
      {
        writeToClient(toUserId, event.join("|"));
      }
      break;

    case "B":
      {
        const clientPool = clientPoolInstance.get();
        for (let toUserId in clientPool) {
          writeToClient(toUserId, event.join("|"));
        }
      }
      break;

    case "S":
      {
        const followers = followRegistryInstance.getUserFollowersList(
          fromUserId
        );
        followers.forEach((follower) => {
          writeToClient(follower, event.join("|"));
        });
      }
      break;
  }
}

exports.followRegistryInstance = followRegistryInstance;
exports.processEvent = processEvent;
