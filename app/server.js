const net = require("net");
const readline = require("readline");

const { processEvent } = require("./eventDispatcher");

const EVENT_PORT = 9090;

let lastSequenceNumber = 0;

// eventListener
function eventListener() {
  net
    .createServer((eventSocket) => {
      const sequenceNumberToMessage = {};
      const readInterface = readline.createInterface({ input: eventSocket });
      readInterface.on("line", (event) => {
        console.log(`Message received: ${event}`);

        const eventParts = event.split("|");
        sequenceNumberToMessage[parseInt(eventParts[0])] = eventParts;

        while (sequenceNumberToMessage[lastSequenceNumber + 1]) {
          const nextMessage = sequenceNumberToMessage[lastSequenceNumber + 1];
          const sequenceNumber = parseInt(nextMessage[0]);

          processEvent(nextMessage);

          lastSequenceNumber = sequenceNumber;
        }
      });
    })
    .listen(EVENT_PORT, "127.0.0.1", (err) => {
      if (err) {
        throw err;
      }
      console.log(`Listening for events on ${EVENT_PORT}`);
    });
}

exports.eventListener = eventListener;
