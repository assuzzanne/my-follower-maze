const { eventListener } = require("./server");
const { clientListener } = require("./client");

eventListener();
clientListener();

process.stdout.on('error', function( err ) {
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});
