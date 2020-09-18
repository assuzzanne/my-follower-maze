//const dotenv = require('dotenv');
const net = require("net");
const { cpuUsage } = require("process");
const readline = require("readline");

const { processEvent } = require("./eventDispatcher");

// dotenv.config()
// to be improved
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
        sequenceNumberToMessage[parseInt(eventParts[0], 10)] = eventParts;

        while (sequenceNumberToMessage[lastSequenceNumber + 1]) {
          const nextMessage = sequenceNumberToMessage[lastSequenceNumber + 1];
          // const nextPayload = nextMessage.join("|");
          const sequenceNumber = parseInt(nextMessage[0]);
          processEvent(event);

          lastSequenceNumber = sequenceNumber;
        }





        // seqNoToMessage.set(parseInt(eventParts[0], 10), eventParts);
        
        // while (seqNoToMessage.size > 0) {
        //   console.log('size', seqNoToMessage.size);
        //   // console.log("SequenceNumber - 1", SequenceNumber);

        //   // if (seqNoToMessage.has(SequenceNumber)) {
        //   //   const message = seqNoToMessage.get(SequenceNumber);
        //   //   // processEvent(message);
        //   //   seqNoToMessage.delete(SequenceNumber);
        //   //   SequenceNumber = parseInt(message[0], 10);

        //   //   console.log("SequenceNumber - 2", SequenceNumber);
        //   // }
        // }
      });
    })
    .listen(EVENT_PORT, "127.0.0.1", (err) => {
      // to be improved
      if (err) {
        throw err;
      }
      console.log(`Listening for events on ${EVENT_PORT}!`);
    });
}

exports.eventListener = eventListener;
