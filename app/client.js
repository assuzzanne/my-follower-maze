const net = require("net");
const readline = require("readline");

const CLIENT_PORT = 9099;

const clientPool = {};
const clientPoolInstance = {
    add: (userId, clientSocket) => clientPool[parseInt(userId)] = clientSocket,
    getOne: (userId) => clientPool[parseInt(userId)], 
    getAll: () => clientPool,
    count: () => Object.keys(clientPool).length,
}
Object.freeze(clientPoolInstance);

// clientListener
function clientListener() {
  net
    .createServer((clientSocket) => {
      const readInterface = readline.createInterface({ input: clientSocket });
      readInterface.on("line", (userId) => {

        if (userId === null) {
          console.error("No user id provided!");
        }

        clientPoolInstance.add(userId, clientSocket);

        console.log(`User connected: ${userId} (${clientPoolInstance.count()} total)`);
      });
    })
    .listen(CLIENT_PORT, "127.0.0.1", (err) => {
      // to be improved
      if (err) {
        throw err;
      }
      console.log(`Listening for client requests on ${CLIENT_PORT}!`);
    });
}

exports.clientPoolInstance = clientPoolInstance;
exports.clientListener = clientListener;
