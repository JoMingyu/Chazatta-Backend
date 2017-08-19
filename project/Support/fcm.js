const FCM = require('fcm-node');
const serverKey = 'AIzaSyCmueK3qHNHuVrsjCDscSc9Rbjm2lyRR4s';

module.exports = {
    fcm: (regesiterId, title, body) => {

        let fcm = new FCM(serverKey);
        let message = {
            to: regesiterId,
            notification: {
                title: title,
                body: body
            }
        };

        fcm.send(message, (err) => {
            if (err) {
                console.log(err);
            }
        });

    }
};