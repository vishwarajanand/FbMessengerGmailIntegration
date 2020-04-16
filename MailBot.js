// const http = require('http')
// const port = parseInt(process.argv[2] || '3000')
const configs = require("./configs/defaults.json")

// include nodemailer to send mails
const nodemailer = require('nodemailer');
const MessengerHelper = require('./MessengerHelper');
const API = require('./API');

let parseMailSubject = function (subject) {
    var subject_parts = subject.split(configs.email_parser_settings.subject_contents_seperator);
    try {
        return {
            psid: subject_parts[0],
            first_name: subject_parts[1],
            last_name: subject_parts[2],
            id: subject_parts[3],
        };
    }
    catch (err) {
        console.log(`Error while parsing mail subject '${subject}': '${err}'`);
        return null
    }
};

let createSubject = function (psid, cb) {
    try {
        let callback = function (user) {
            cb(JSON.parse(user));
        };
        API.getUser(psid, callback);
    }
    catch (err) {
        console.log(`Error while fetching user details: '${err}'`);
        return null;
    }
};

let parseMailBodyLatestThread = function (body) {
    var body_parts = body.split(configs.email_parser_settings.thread_seperator);
    return body_parts.length > 0 ? body_parts[0] : "";
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configs.email_server.gmail_username,
        pass: configs.email_server.gmail_password
    }
});

exports.sendMail = function (psid, msg) {

    let mail_sender_cb = function (options) {
        // email options
        let mailOptions = {
            from: configs.email_server.gmail_username,
            to: configs.email_server.forward_alias || configs.email_server.gmail_username,
            subject: options.psid_expanded,
            inReplyTo: options.psid_expanded,
            text: msg || options.msg
        };

        // send email
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
            }
            console.log(response)
        });
    }
    createSubject(psid, mail_sender_cb.bind({ "msg": msg }));
};

// receive mails on master by mail-notifier
const notifier = require('mail-notifier');
const imap = {
    user: configs.email_server.gmail_username,
    password: configs.email_server.gmail_password,
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,// use secure connection
    tlsOptions: { rejectUnauthorized: false }
};

var notification = notifier(imap)
    .on('mail', mail => {
        // simpleParser(mail, { streamAttachments: true }, (err, parsed) => {
        //     console.log("parsed.headers", parsed.headers);
        //     console.log("parsed.subject", parsed.subject);
        //     console.log("parsed.to", parsed.to);
        //     console.log("parsed.cc", parsed.cc);
        //     console.log("parsed.bcc", parsed.bcc);
        //     console.log("parsed.date", parsed.date);
        //     console.log("parsed.messageId", parsed.messageId);
        //     console.log("parsed.inReplyTo", parsed.inReplyTo);
        //     // console.log("parsed.reply-to", parsed.reply - to);
        //     console.log("parsed.references", parsed.references);
        //     console.log("parsed.html", parsed.html);
        //     console.log("parsed.text", parsed.text);
        //     console.log("parsed.textAsHtml", parsed.textAsHtml);
        //     console.log(JSON.stringify(parsed));
        // });
        console.log(mail);

        // get the message
        var mail_body_threads = parseMailBodyLatestThread(mail.text);
        var parsed_subject = parseMailSubject(mail.subject);
        if (parsed_subject) {
            MessengerHelper.sendMessageText(parsed_subject.psid, mail_body_threads);
        } else {
            mail
        }
    }).start();

notification.on('end', function () {
    console.log('...notification ended...');
});

notification.on('error', function (err) {
    console.log('...notification error : %s', err);
});

notification.start();
