var Log = require('../models/log').model;
var logPlugin = require('posable-logging-plugin');

var testSetup = function(testLogPlugin) {
    logPlugin = testLogPlugin;
    return testLogPlugin;
};

var mapLogEntry = function(msg) {
    try {
        var logEntry = new Log();
        logEntry.server = msg.server;
        logEntry.application = msg.application;
        logEntry.level = msg.logLevel;
        logEntry.message = msg.message;
        if (typeof(msg) == 'string') {
            logEntry.stack = 'No Error Trace';
        } else {
            logEntry.stack = msg.stack;
        }
        return logEntry;

    } catch (err) {
        logPlugin.error(err);
        //msg.nack();
    }
};

var createLogEntry = function(msg){
    try {
        var newLog = mapLogEntry(msg.body);
        newLog.save(function (err) {
            if (err) {
                logPlugin.error(err);
                //msg.nack();
            } else {
                logPlugin.debug('Log saved successfully');
                //msg.ack();
            }
        });
        console.log('Received from rabbit: ', JSON.stringify(msg.body));
        msg.ack(); // <- will eventually move to else block above
    } catch (err){
        logPlugin.error(err);
        //msg.nack();
    }
};


module.exports = {
    createLogEntry: createLogEntry,
    mapLogEntry: mapLogEntry,
    testSetup: testSetup
};

