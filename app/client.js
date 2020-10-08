const net = require("net");
const readline = require("readline");

const CLIENT_PORT = process.env.CLIENT_PORT || 9099;

const { clientPoolInstance } = require("./singletons/clientPoolInstance");
const { deadLetterQueueInstance } = require("./singletons/deadLetterQueue");

function writeToClient(userId, event) {
  const socket = clientPoolInstance.getOne(userId);
  if (!socket) {
    deadLetterQueueInstance.enqueue(event);
    console.info(
      "Message added to the dead letter queue successfully!",
      event,
      deadLetterQueueInstance.count()
    );
    return;
  }

  socket.write(event + "\n");
}

function clientListener() {
  net
    .createServer((clientSocket) => {
      const readInterface = readline.createInterface({ input: clientSocket });
      readInterface.on("line", (userIdString) => {
        if (!userIdString) {
          console.error("No userId provided!");
        }

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

exports.clientListener = clientListener;
exports.writeToClient = writeToClient;
