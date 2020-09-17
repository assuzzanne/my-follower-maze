const followRegistry = {};

module.exports = function treatAndDispatch(event) {
  // event 66|S|25
  const eventData = event.split("|");
  const eventType = eventData[1];

  const fromUserId = parseInt(event[2]);
  const toUserId = parseInt(event[3]);

  switch (eventType) {
    case "F":
      // Follow
      {
        const followers = followRegistry[toUserId] || new Set([]);
        followers.add(fromUserId);
        followRegistry[toUserId] = followers;

        // const socket = clientPool[toUserId];
        // if (socket) {
        //   socket.write(event + "\n");
        // }  
      }
      break;

    case "U":
      // Unfollow
      {
        const followers = followRegistry[toUserId] || new Set([]);
        followers.delete(fromUserId);
        followRegistry[toUserId] = followers;
      }
      break;

    case "P":
      // Private Msg
      {
 
        // const socket = clientPool[toUserId];
        // if (socket) {
        //   socket.write(event + "\n");
        // }
      }
      break;

    case "B":
      // Brodcast
      {

        // for all the client-user identificated, this event will be sent by the server
        // for (let toUserId in clientPool) {
        //   const socket = clientPool[toUserId];
        //   if (socket) {
        //     socket.write(nextPayload + "\n");
        //   }
        // }
      }
      break;

    case "S":
      // Status Update
      {

        const followers = followRegistry[fromUserId] || new Set([]);
        followers.forEach((follower) => {
          // sends an event/notification to every follower of the user updating his status

          // const socket = clientPool[follower];
          // if (socket) {
          //   socket.write(nextPayload + "\n");
          // }
        });
      }
      break;

    default:
      {
        console.error(`Failed to process event ${event}!`)
      }
      break;
  }
};
