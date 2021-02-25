// Require express and body-parser
const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');
const express = require("express");
const bodyParser = require("body-parser");

// Initialize express and define a port
const app = express();
const app1 = conversation({ debug: true });
const PORT = 3001;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

app1.handle('getItem', conv => {
    conv.add(`Searching for the part: ${conv.session.params.ItemToFind}`);
});

app.post("/hook", (req, res) => {
    console.log(req.body); // Call your action on the request here
    res.status(200).end(); // Responding is important
});

// Start express on the defined port
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app1);
module.exports = app;
