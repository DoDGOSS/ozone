const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log(`Sample widgets server listening on port: ${PORT}`);
});

process.on("SIGINT", function() {
    console.log("Caught SIGINT. Shutting down...");
    shutdown();
});

process.on("SIGTERM", function() {
    console.log("Caught SIGTERM. Shutting down...");
    shutdown();
});

function shutdown() {
    server.close(() => {
        console.log("Sample widgets server process has terminated");
    });
}
