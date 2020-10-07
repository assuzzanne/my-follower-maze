// const followEventHandler = require("./handlers/followEventHandler");
// const unfollowEventHandler = require("./handlers/unfollowEventHandler");
// const privateMessageEventHandler = require("./handlers/privateMessageEventHandler");
// const broadcastEventHandler = require("./handlers/broadcastEventHandler");
// const statusUpdateEventHandler = require("./handlers/statusUpdateEventHandler");

// const { deadLetterQueueInstance } = require("./singletons/deadLetterQueue");

// function processEvent(event) {
//   const eventType = event[1];

//   const fromUserId = parseInt(event[2], 10);
//   const toUserId = parseInt(event[3], 10);

//   switch (eventType) {
//     case "F":
//       {
//         followEventHandler(toUserId, fromUserId, event);
//       }
//       break;

//     case "U":
//       {
//         unfollowEventHandler(toUserId, fromUserId);
//       }
//       break;

//     case "P":
//       {
//         privateMessageEventHandler(toUserId, event);
//       }
//       break;

//     case "B":
//       {
//         broadcastEventHandler(event);
//       }
//       break;

//     case "S":
//       {
//         statusUpdateEventHandler(fromUserId, event);
//       }
//       break;

//     default:
//       console.log("Failed to dispatch the message!");
//       deadLetterQueueInstance.enqueue(event);
//       console.log(
//         "Message added to dead letter queue successfully!",
//         console.log(deadLetterQueueInstance.size())
//       );
//   }
// }

// exports.processEvent = processEvent;
