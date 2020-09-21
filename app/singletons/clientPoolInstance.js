const clientPool = {};
const clientPoolInstance = {
  add: (userIdString, clientSocket) => {
    const userId = parseInt(userIdString, 10);
    if (clientPool[userId]) {
      return;
    }
    clientPool[userId] = clientSocket;
  },
  getOne: (userIdString) => clientPool[parseInt(userIdString, 10)],
  get: () => clientPool,
  count: () => Object.keys(clientPool).length,
};
Object.freeze(clientPoolInstance);

exports.clientPoolInstance = clientPoolInstance;
