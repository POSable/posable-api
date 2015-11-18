var Log = require('../models/log').model;
var mongoose = require('mongoose');
var logPlugin = require('posable-logging-plugin');

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
    }
};

var createLogEntry = function(msg){
    var newLog = mapLogEntry(msg.body);
    newLog.save(function(err) {
        if (err) {
            logPlugin.error(err);
        } else {
            console.log('Log saved successfully');
        }
    });
    console.log( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
};


module.exports = createLogEntry;

