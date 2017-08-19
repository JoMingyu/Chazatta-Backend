const FCM = require('fcm-node');

module.exports = {
    fcm: (serverkey, regesiterId, title, body) => {

        let fcm = new FCM(serverkey);

        let message = {
            to: regesiterId,
            notification: {
                title: title,
                body: body
            }
        };

        fcm.send(message, (err, response) => {
            if (err) {
                console.log(err);
            }
        });

    }
};