const axios = require('axios');
const log = require('clean-log');
const createNotificationPayload = require('./createNotificationPayload');

module.exports = (pipeline) => {

    return new Promise((resolve, reject) => {
        let notification = createNotificationPayload(pipeline);

        axios.post(process.env.WEBHOOK_URL, notification)
            .then((response) => {
                return resolve(null)
            })
            .catch((error) => {
                log.error(`Unable to send notification because ${JSON.stringify(error,null,2)}`);
                return reject(error)
            });
    })
};