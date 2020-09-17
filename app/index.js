//const dotenv = require('dotenv');
const net = require("net");
const readline = require("readline");

// dotenv.config()
// optimise 
const EVENT_PORT = 9090;
const CLIENT_PORT = 9099;

const clientPool = {};
const followRegistry = {};

let lastSeqNo = 0;

net
  .createServer((socket) => {
    // server creates socket
    const seqNoToMessage = {};
    // The readline module provides an interface for reading data from a Readable stream (such as process.stdin) one line at a time.
    // The Readable stream to listen to
    const readInterface = readline.createInterface({ input: socket });
    readInterface.on("line", (payload) => {
      // payload = data of my event received through my connection socket
      console.log(`Message received: ${payload}`);

      // creates an array of payload
      const payloadParts = payload.split("|");
      // [ 99429, S, 30]
      seqNoToMessage[parseInt(payloadParts[0])] = payloadParts;
      // seqNoToMessage[99429] = [ "99429", "S", "30"];
      // const seqNoToMessage = {
      //   3511: ["3511", "S", "22"],
      //   3512: ["3512", "S", "4"],
      //   3513: ["3513", "S", "7"],
      //   3514: ["3514", "P", "29", "28"],
      // };

      while (seqNoToMessage[lastSeqNo + 1]) {
        // next key of my object: last + 1 = the event being processed
        // pattern of some shitty iteration

        // seqNoToMessage[3511] then seqNoToMessage[3512]
        const nextMessage = seqNoToMessage[lastSeqNo + 1];
        // ["3512", "S", "4"]
        const nextPayload = nextMessage.join("|");
        // "3512|S|4"

        const seqNo = parseInt(nextMessage[0]);
        // 3512
        const kind = nextMessage[1];
        // "S"

        
        switch (kind) {
          case "F":
            // an user starts to follow another user
            {
              // '3325': [ '3325', 'F', '8', '14' ],
              const fromUserId = parseInt(nextMessage[2]);
              // 8
              // the user making the action
              const toUserId = parseInt(nextMessage[3]);
              // 14
              // the followed User

              // const followRegistry = { 14: Set{Follower1, Follower2}, 15: Set{Follower1, Follower2}};
              const followers = followRegistry[toUserId] || new Set([]);
              followers.add(fromUserId);

              // update Set of user in object followRegistry
              followRegistry[toUserId] = followers;

              // const clientPool = {'14': {socket}, '16': {socket}}
              const socket = clientPool[toUserId];
              // The user clients connect on port 9099 and identify themselves with their user ID
              // if followed user connected
              // the sever/socket sends to the user client the event (payload): "3325|F|8|14
              //  notification
              if (socket) {
                socket.write(nextPayload + "\n");
              }
            }
            break;

          case "U":
            // an user unfollow another user
            {
              const fromUserId = parseInt(nextMessage[2]);
              // the user making the action
              const toUserId = parseInt(nextMessage[3]);
              // the unfollowed user

              // update
              // the user making the action is removed from the unefollowed user's followers list
              const followers = followRegistry[toUserId] || new Set([]);
              followers.delete(fromUserId);
              followRegistry[toUserId] = followers;
            }
            break;

          case "P":
            // Private Msg
            {
              // 43|P|32|56
              const toUserId = parseInt(nextMessage[3]);

              // the sever/socket sends to the user client the event (payload): 43|P|32|56
              // a notification
              const socket = clientPool[toUserId];
              if (socket) {
                socket.write(nextPayload + "\n");
              }
            }
            break;

          case "B":
            // Brodcast
            // 542532|B
            {
              for (let toUserId in clientPool) {
                // for all the client-user identificated, this event will be sent by the server
                const socket = clientPool[toUserId];
                if (socket) {
                  socket.write(nextPayload + "\n");
                }
              }
            }
            break;

          case "S":
            // Status Update
            // 634|S|32
            {
              const fromUserId = parseInt(nextMessage[2]);
              // 32
              const followers = followRegistry[fromUserId] || new Set([]);

              followers.forEach((follower) => {
                // sends an event/notification to every follower of the user updating his status
                const socket = clientPool[follower];
                if (socket) {
                  socket.write(nextPayload + "\n");
                }
              });
            }
            break;
        }

        lastSeqNo = seqNo;
        // 3512
      }
    });
  })
  .listen(EVENT_PORT, "127.0.0.1", (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening for events on ${EVENT_PORT}`);
  });

net
  .createServer((clientSocket) => {
    const readInterface = readline.createInterface({ input: clientSocket });
    readInterface.on("line", (userIdString) => {
      if (userIdString != null) {
        // The user clients connect on port 9099 and identify themselves with their user ID.
        // For example, once connected a user client may send down 2932\r\n, indicating that it is representing user 2932.
        clientPool[parseInt(userIdString)] = clientSocket;
        console.log(
          `User connected: ${userIdString} (${clientPool.length} total)`
        );
      }
      // if null?
    });
  })
  .listen(CLIENT_PORT, "127.0.0.1", (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening for client requests on ${CLIENT_PORT}`);
  });
