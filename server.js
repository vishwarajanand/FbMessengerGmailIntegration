// Not needed in Glitch
require('dotenv').config();
const configs = require("./configs/defaults.json");

// init project
var express = require('express');
var app = express();
const MessengerHelper = require('./MessengerHelper');
const ResponseHandler = require('./ResponseHandler');
var bodyParser = require('body-parser');
const API = require('./API');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Braintree
var braintree = require('braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: configs.braintee_settings.MERCHANT_ID,
  publicKey: configs.braintee_settings.PUBLIC_KEY,
  privateKey: configs.braintee_settings.PRIVATE_KEY
});

app.get('/get_token', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response);
  });
});


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('demos'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//webhok verification
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === 'TRAINING_BOT') {
    console.log('FB Webhook verification request received');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed FB Webhook verification');
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log(" ~~ Webhook ping request ~~ ");
  // Make sure this is a page subscription
  if (data && data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched, use mid to uniquely identify a new message
    data.entry.forEach(function (pageEntry) {

      // // Gets the body of the webhook event
      // let webhook_event = pageEntry.messaging[0];
      // console.log(webhook_event);

      // // Get the sender PSID
      // let sender_psid = webhook_event.sender.id;
      // console.log('Sender PSID: ' + sender_psid);

      var pageID = pageEntry.id;
      if (pageEntry.messaging) {
        // Iterate over each messaging event
        pageEntry.messaging.forEach(function (messagingEvent) {
          if (!messagingEvent.message &&
            !messagingEvent.postback &&
            !messagingEvent.referral
          ) {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
            return;
          }

          var user = API.getUser(messagingEvent.sender.id, function (user) {
            if (messagingEvent.message) {
              ResponseHandler.receivedMessage(user, messagingEvent);

            } else if (messagingEvent.postback) {
              ResponseHandler.receivedPostback(user, messagingEvent);

            } else if (messagingEvent.referral) {
              ResponseHandler.receivedReferral(user, messagingEvent);
            }
            else {
              console.log("Webhook received unknown messagingEvent: ", messagingEvent);
            }
          });
        });
      }
    });
  }
  else {
    console.log("undefined data");
  }
  // Assume all went well.
  //
  // You must send back a 200, within 20 seconds, to let us know you've
  // successfully received the callback. Otherwise, the request will time out.
  res.sendStatus(200);
});

// listen for requests :)
var listener = app.listen(configs.server_settings.PORT, function () {
  console.log('Your app server is listening on port ' + configs.server_settings.PORT);
});
