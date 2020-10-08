const net = require("net");
const readline = require("readline");

const EVENT_PORT = process.env.EVENT_PORT || 9090;

const { eventBus } = require("./singletons/eventBus");
const { deadLetterQueueInstance } = require("./singletons/deadLetterQueue");

const followEventHandler = require("./handlers/followEventHandler");
const unfollowEventHandler = require("./handlers/unfollowEventHandler");
const privateMessageEventHandler = require("./handlers/privateMessageEventHandler");
const broadcastEventHandler = require("./handlers/broadcastEventHandler");
const statusUpdateEventHandler = require("./handlers/statusUpdateEventHandler");

let lastSequenceNumber = 0;

function processEvent(event) {
  const eventType = event[1];
  if (!eventType) {
    deadLetterQueueInstance.enqueue(event);
    console.log(
      "Message added to the dead letter queue successfully!", deadLetterQueueInstance.count()
    );
  }

  const fromUserId = parseInt(event[2], 10);
  const toUserId = parseInt(event[3], 10);

  eventBus.publish(eventType, { toUserId, fromUserId, event });
}

function eventListener() {
  net
    .createServer((eventSocket) => {
      const sequenceNumberToMessage = {};
      const readInterface = readline.createInterface({ input: eventSocket });

      // subscriptions
      eventBus.subscribe("F", (args) =>
        followEventHandler(args.toUserId, args.fromUserId, args.event)
      );
      eventBus.subscribe("U", (args) => {
        unfollowEventHandler(args.toUserId, args.fromUserId);
      });
      eventBus.subscribe("P", (args) =>
        privateMessageEventHandler(args.toUserId, args.event)
      );
      eventBus.subscribe("B", (args) => broadcastEventHandler(args.event));
      eventBus.subscribe("S", (args) =>
        statusUpdateEventHandler(args.fromUserId, args.event)
      );

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
