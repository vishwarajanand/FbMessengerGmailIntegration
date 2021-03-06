const MessengerHelper = require('./MessengerHelper');
const API = require('./API');
const MailBot = require('./MailBot');

// Add code to implement the tasks here.

exports.receivedMessage = function (user, messagingEvent) {
    console.log(`User: '${user}'`);
    console.log(`MessagingEvent: '${messagingEvent}'`);
    const psid = messagingEvent.sender.id;
    // const psid = user.psid;
    console.log(`Text message received from ${psid}`);
    console.log(messagingEvent);
    try{
        MailBot.sendMail(psid, messagingEvent.message.text);
    }
    catch(err){
        console.log(`MAIL SENDING FAILED: '${err}'`);
    }
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
