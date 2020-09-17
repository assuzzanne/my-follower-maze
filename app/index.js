const { eventListener } = require("./server");
const { clientListener } = require("./client");

eventListener();
clientListener();
