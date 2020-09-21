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
  getAll: () => followRegistry,
};
Object.freeze(followRegistryInstance);

exports.followRegistryInstance = followRegistryInstance;
