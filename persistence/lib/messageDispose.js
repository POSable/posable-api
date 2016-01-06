var logPlugin = require('posable-logging-plugin');

var msgDispose = function (msg, err) {
    console.log('Here I am');
        //if (err && err.deadLetter === true) {
        //    logPlugin.debug('msg sent to dead letter que');
        //    msg.reject();
        //} else if (err) {
        //    logPlugin.debug('msg nacked');
        //    // keep track of nack attempts
        //    msg.nack();
        //} else {
        //    logPlugin.debug('msg acked');
        //    msg.ack();
        //}
    msg.nack();
};

module.export = msgDispose;