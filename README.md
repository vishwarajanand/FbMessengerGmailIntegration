# FbMessengerGmailIntegration
This project aims to demo integration of Facebook Messenger with Gmail. Several businesses cannot have customer support resources respond to the messages sent to their Facebook Page causing a not-so-great customer service. Also, most businesses in today's world have some sort of customer support which runs over email. This project aims to bridge this gap where a business can smoothly let their customer support teams (or on-call teams) respond in realtime to the messages dropped on their Facebook Page from existing email channel like Gmail.

## Demo Video

[![Watch on YouTube](https://img.youtube.com/vi/gktg9gnl6EM/hqdefault.jpg)](https://youtu.be/gktg9gnl6EM)

https://youtu.be/gktg9gnl6EM

## Preview

![Messenger bot sends a message](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Message-From-FB-Page.png "Messenger bot sends a message")


![Email is forwarded via GMail](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Mail-Sent-via-Gmail.png "Email is forwarded via GMail")


![Email can be replied from any email client](https://raw.githubusercontent.com/vishwarajanand/FbMessengerGmailIntegration/master/demos/Mail-delivered-to-destination.png "Email can be replied from any email client")


## Tools

1. We use [Glitch](https://glitch.com/) which is a platform which provides free hosting of NodeJS server over an `https` URL.
2. Alternatively, one can use [ngrok](https://ngrok.com/) which provides a tunnel from a public URL to local development PC for easier testing and debugging.
3. [Nodemon](https://www.npmjs.com/package/nodemon) helps live reload applications when the source is changed and loaded locally.

# Configs
Following configurations are required for boot starting:

1. `gmail_username` and `gmail_password` which would be used for forwarding emails.
2. `forward_alias` where emails can be forwarded.
3. Enable `Less Secure Apps` so that Google does not block sign-in attempt by checking the toggle [here](https://myaccount.google.com/lesssecureapps?pli=1). 
4. Enable IMAP in your Gmail account settings as described [here](https://support.google.com/mail/answer/7126229?hl=en)


## Testing

1. Edit the `configs/defaults.json` with your configurations.

2. Host your bot on a publicly accessible URL, follow either of the below-mentioned sub-points:

a. Use a glitch bot, which gives a URL like this: https://glitch.com/~anand-messenger-bot

b. If you use ngrok, buy a certificate and host your server on `https` by `./tools/dev-ngrok.sh`. Can use a custom domain also to avoid making frequent changes in webhook URL.

3. Setup Facebook Messenger bot and provide the messenger bot URL for verification. The token is `TRAINING_BOT`.

4. Once hosted, if anyone sends a message to your page an email is received and vice versa if that email is replied, a message is popped in the Facebook Messenger of the user.


## Flow

1. When any user sends a message from messenger UI to page, we get a webhook ping like below:
```
{
    sender: { id: '2872396396200934' },
    recipient: { id: '308443763363318' },
    timestamp: 1586360660992,
    message: {
        mid: 'm_M2-JIMCQwQp0cFQ5zJPG8eY7lzkyVX8zM1Mq-eplFTg0bmgLsd0YfdFFkGPu-oNyoJAJk2511AZzX2p5QZS8UQ',
        text: 'Where are you located?'
    }
}
```

2. Details of params:
`psid` or `sender` is EntMessengerPageScopedID and does not represent a FB User but just an entity for user to page conversation.
`recipient` is the page id.
`mid` represents a unique id of every message.
`timestamp` is the unix timestamp in millis with GMT timezone.
`text` is the unicode encoded text

3. We can get the details of who the user is by making the following call:
`https://graph.facebook.com/${psid}?fields=first_name,last_name,profile_pic&access_token=${page_access_token}`

4. We can send a message back by a POST call to the message sender like below:

```
https://graph.facebook.com/v6.0/me/messages
{
    recipient: {
            id: ${psid},
        },
        message: {
            text: ${message}
        }
}
```
5. We use an email sender plugin to send mails using [SMTP protocol](https://www.npmjs.com/package/nodemailer) and receive them using [IMAP protocol](https://www.npmjs.com/package/mail-notifier).

## Common issues

1. FB Page only replies to me, but not someone else?

> The Facebook app is likely still in Development Mode. You can add someone as a tester of the app, if they accept, the app will be able to message them. Once ready, you may request the pages_messaging permission to be able to reply to anyone.

2. Nowhere to host the FB Messenger bot

> Use glitch (free) or ngrok (paid to use https) or any other tunnelling software to get a public URL for your deployment. `ngrok http 3000`

3. Cannot connect to the server

> Check whether `require('dotenv').config();` is enabled or not. If not enabled and not running in glitch (where .env files are autoloaded), the server may not run on port 3000.

## Other Sources

The system is made up in two parts (both are my previous repos):

1. To send a message from FB Messenger, detailed explanation [here](https://github.com/vishwarajanand/FbMessengerBot).
2. To send and reply to emails, detailed explanation  [here](https://github.com/vishwarajanand/NodeJsMailSendNReceive).
