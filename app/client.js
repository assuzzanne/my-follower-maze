const net = require("net");
const readline = require("readline");

const CLIENT_PORT = 9099;

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

function writeToClient(userId, event) {
  const socket = clientPoolInstance.getOne(userId);
  if (!socket) {
    return;
  }
  
  socket.write(event + "\n");
}

// clientListener
function clientListener() {
  net
    .createServer((clientSocket) => {
      const readInterface = readline.createInterface({ input: clientSocket });
      readInterface.on("line", (userIdString) => {
        if (!userIdString) {
          console.error("No userId provided!");
        }

        // clientPool[parseInt(userIdString)] = clientSocket;
        clientPoolInstance.add(userIdString, clientSocket);
        console.log(
          `User connected: ${userIdString} (${clientPoolInstance.count()} total)`
        );
      });
    })
    .listen(CLIENT_PORT, "127.0.0.1", (err) => {
      if (err) {
        throw err;
      }
      console.log(`Listening for client requests on ${CLIENT_PORT}`);
    });
}

exports.clientPoolInstance = clientPoolInstance;
exports.clientListener = clientListener;
exports.writeToClient = writeToClient;
