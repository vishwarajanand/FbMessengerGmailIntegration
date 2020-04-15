const MessengerHelper = require('./MessengerHelper');
const API = require('./API');
var MailBot = require('MailBot');

// Add code to implement the tasks here.

exports.receivedMessage = function (user, messagingEvent) {
    const psid = messagingEvent.sender.id;
    console.log(`Text message received from ${psid}`);
    console.log(messagingEvent);
    MailBot.sendMail(psid, messagingEvent.message.text);
}

exports.receivedPostback = function (user, messagingEvent) {
    const psid = messagingEvent.sender.id;
    console.log(`Postback received from ${psid}`);
    console.log(messagingEvent);
};

exports.receivedReferral = function (user, messagingEvent) {
    const psid = messagingEvent.sender.id;
    console.log(`Referral received from ${psid}`);
    console.log(messagingEvent);
};
