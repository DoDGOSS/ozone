const express = require("express");
const path = require("path");
const app = express();

const PORT = 4000;

app.use(express.static("build"));
app.use(express.static("public"));
app.listen(PORT);

console.log(`Example widgets server listening on port ${PORT}`);
