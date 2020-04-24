# FbMessengerGmailIntegration
Integrating Facebook Messenger with Gmail

# Preview

![Messenger bot sends a message](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Message-From-FB-Page.png.png "Messenger bot sends a message")


![Email is forwarded via GMail](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Mail-Sent-via-Gmail.png "Email is forwarded via GMail")


![Email can be replied back from any email client](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Mail-delivered-to-destination.png "Email can be replied back from any email client")


# Testing

1. Edit the `configs/defaults.json` with your own configurations.

2. Use a glitch bot:
https://glitch.com/~anand-messenger-bot

3. Setup Facebook Messenger bot and provide the messenger bot URL for vertification. The token is `TRAINING_BOT`.

4. Once hosted, if anyone sends a message to your page an email is received and vice versa, if that email is replied, a message is popped in the Facebook Messenger of the user.

# Sources

The system is made up in two parts - both are my previous repos:

1. To send a message from FB Messenger, detailed explanation [here](https://github.com/vishwarajanand/FbMessengerBot).
2. To send and reply to emails, detailed explanation  [here](https://github.com/vishwarajanand/NodeJsMailSendNReceive).
