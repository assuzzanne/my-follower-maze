//const dotenv = require('dotenv');
const net = require("net");
const readline = require("readline");

const eventDispatcher = require("./eventDispatcher");

// dotenv.config()
// to be improved
const EVENT_PORT = 9090;

// eventListener
function eventListener(){
  net
  .createServer((eventSocket) => {
    const readInterface = readline.createInterface({ input: eventSocket });
    readInterface.on("line", (event) => {
      console.log(`Message received: ${event}`);
      eventDispatcher(event);
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
  
