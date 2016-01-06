/**
 * Created by davidabramowitz on 1/6/16.
 */
var logPlugin = require('posable-logging-plugin');

var msgDispose = function (msg, err) {
    try {
        if (err && err.deadLetter === true) {
            logPlugin.debug('Message sent to dead letter que');
            msg.reject();
        } else if (err) {
            logPlugin.debug('Message nacked');
            // keep track of nack attempts
            msg.nack();
        } else {
            logPlugin.debug('Message acked');
            msg.ack();
        }
    } catch (err) {
        logPlugin.error('System Error in Rabbit Message Dispose');
        throw err;
    }
};

module.exports = msgDispose;