import axios from "axios";
import { getMessaging } from "./getFirebaseAdmin.js";

/**
 * Figure out firebase. Check docs here
 * https://firebase.google.com/docs/admin/setup
 */

export const sendNotification = async (tokens, body, title, data = {}) => {
    const messaging = getMessaging();

    let actions = [];
    let link = undefined;
    if (data.action) {
        actions.push({
            action: data.action.link,
            title: data.action.title || "View",
        });

        link = data.action.link;
    }

    return messaging
        .sendEachForMulticast({
            tokens,
            // collapse_key: "standard",
            // priority: 10,
            notification: {
                body,
                title,
            },
            data: {
                body,
                title,
                link,
            },
            webpush: {
                headers: {
                    TTL: "86400",
                },
                fcmOptions: {
                    link,
                },
                notification: {
                    title,
                    body,
                    data,
                    actions,
                },
            },
        })
        .then((result) => {
            return result;
        });
};

export const sendNotificationLegacy = async (
    token,
    title,
    body,
    link = null,
    data = {}
) => {
    try {
        const response = await axios.post(
            "https://fcm.googleapis.com/fcm/send",
            {
                to: token,
                collapse_key: "market_range",
                priority: 10,
                notification: {
                    body: body,
                    title: title,
                    link: link,
                    click_action: link,
                },
                data,
                webpush: {
                    headers: {
                        TTL: "86400",
                    },
                    fcm_options: {
                        link: link,
                    },
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "key=AAAAk8zXgik:APA91bGo1rYfL1YryszPj9BBMGCdvm2c4c-PvPZvs2WSFBxy6t3gf1yL_cD-aPYa1zQVSLSlPBlcrVyk9r7R-ONBbBzjnZtrWuGOMeAxX1lhf8E-8iW3Luhb11CDnMIxjIIPMeY2xHSi",
                },
            }
        );
        return response.data;
    } catch (err) {
        console.log("caught error", err);
        return err.response || err;
    }

    /*
    deviceResults[ut.deviceName] = await messaging.send(
        {
            token,
            notification: {
                body: "Notification body text " + moment().toISOString(),
                title: text,
            },
            android: {
                notification: {
                    clickAction: "https://google.com/3",
                },
            },
            webpush: {
                fcmOptions: {
                    link: "https://google.com/1",
                },
            },
        }
        // ,
        // {
        //     priority: "high",
        //     timeToLive: 60 * 60 * 24,
        // }
    )
    */
    // const send = await messaging.send({
    //     token,
    //     notification: {
    //         body: "Notification body text " + moment().toISOString(),
    //         title: text,
    //     },
    //     webpush: {
    //         notification: {
    //             title: "Webhook: Notification body text " + moment().toISOString(),
    //             body: "Webhook: " + text,
    //             silent: false,
    //             timestamp: Date.now(),
    //             vibrate: [200, 100, 200],
    //         },
    //         // fcm_options: {
    //         //     link: "https://dummypage.com",
    //         // },
    //     },
    // })
};
