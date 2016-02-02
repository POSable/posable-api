var Log = require('../models/log').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var testingStub = function(testLogPlugin, testLog, testDispose) {
    logPlugin = testLogPlugin;
    Log = testLog;
    wascallyRabbit = testDispose;
};

var mapLogEntry = function(msg) {
        logPlugin.debug('Starting to map log entry to Log model');

        var logEntry = new Log();
        logEntry.server = msg.server;
        logEntry.application = msg.application;
        logEntry.level = msg.logLevel;
        logEntry.message = msg.message;

        if (typeof(msg) === 'string') {
            logEntry.stack = 'No Error Trace';
        } else {
            logEntry.stack = msg.stack;
        }
        logPlugin.debug('Finished mapping log entry to Log model');

        return logEntry;

};

var createLogEntry = function(msg){
    try {
        logPlugin.debug('Starting createLogEntry function - handler');
        logPlugin.debug('Received from rabbit: ', JSON.stringify(msg.body));
        var newLog = mapLogEntry(msg.body);

        newLog.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Log saved successfully');
            }
            wascallyRabbit.rabbitDispose(msg, err);
        });

    } catch (err){
        err.deadLetter = true;
        logPlugin.error(err);
        wascallyRabbit.rabbitDispose(msg, err);
        throw err;
    }
};

module.exports = {
    createLogEntry: createLogEntry,
    mapLogEntry: mapLogEntry,
    testingStub: testingStub
};