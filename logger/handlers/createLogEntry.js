var Log = require('../models/log').model;
var logPlugin = require('posable-logging-plugin');
var rabbitDispose = require('../lib/rabbitMsgDispose');

var testingStub = function(testLogPlugin, testLog, testRabbitDispose) {
    logPlugin = testLogPlugin;
    Log = testLog;
    rabbitDispose = testRabbitDispose
};

var mapLogEntry = function(msg) {

        logPlugin.debug('Starting to map log entry to Log model');
        var logEntry = new Log();
    console.log("here", logEntry);
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
            rabbitDispose(msg, err)
        });

    } catch (err){
        err.deadLetter = true;
        logPlugin.error(err);
        rabbitDispose(msg, err);
        throw err;
    }
};

module.exports = {
    createLogEntry: createLogEntry,
    mapLogEntry: mapLogEntry,
    testingStub: testingStub
};