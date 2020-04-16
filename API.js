const config = require("./config");
const request = require("request");
const fetch = require("node-fetch");
const BASE_GRAPH_API_PREFIX = "https://graph.facebook.com/v6.0/";

// Sends AppEvents to FB
exports.sendAppEvent = function (psID, eventName) {
    console.log("sending App Event");

    const options = {
        method: "POST",
        uri: `${BASE_GRAPH_API_PREFIX}`
    };
    request.post(
        {
            url: `https://graph.facebook.com/${config.APPID}/activities`,
            form: {
                event: "CUSTOM_APP_EVENTS",
                custom_events: JSON.stringify([
                    {
                        _eventName: eventName
                    }
                ]),
                advertiser_tracking_enabled: 1,
                application_tracking_enabled: 1,
                extinfo: JSON.stringify(["mb1"]),
                page_id: config.PAGEID,
                page_scoped_user_id: psID
            }
        },
        function (err, httpResponse, body) {
            console.error(err);
            console.log(httpResponse.statusCode);
            console.log(body);
        }
    );
};

// get user profile
exports.getUser = function (psID, cb) {
    // const url = `https://graph.facebook.com/${psID}?fields=first_name,last_name,profile_pic&access_token=${config.PAGE_ACCESS_TOKEN}`;
    // const getData = async url => {
    //     try {
    //         const response = await fetch(url);
    //         const op = await response.json();
    //         delete op['profile_pic'];
    //         op.psid = psID;
    //         console.log(json);
    //         return op;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // user_json = await getData(url);
    // return user_json;
    request.get(
        {
            url: `https://graph.facebook.com/${psID}?fields=first_name,last_name,profile_pic&access_token=${config.PAGE_ACCESS_TOKEN}`
        },
        function (err, httpResponse, body) {
            if (err) {
                throw err;
            }
            // console.log(httpResponse.statusCode);
            // console.log(body);
            var op = JSON.parse(body);
            delete op['profile_pic'];
            op.psid = psID;
            cb(op);
            // cb.bind(op);
        }
    );
};
