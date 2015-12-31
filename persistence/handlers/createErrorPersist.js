var Error = require('../models/error').model;
var mongoose = require('mongoose');
var logPlugin = require('posable-logging-plugin');

var mapError = function(msg) {
    try {
        var errorMsg = new Error();
        errorMsg.server = msg.server;
        errorMsg.application = msg.application;
        errorMsg.data = msg.data;

        return errorMsg;

    } catch (err) {
        logPlugin.error(err);
        msg.reject();
    }
};

var createErrorPersist = function(msg){
    try {
        var newError = mapError(msg.body);
        newError.save(function(err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Error saved successfully');
            }
        });
        logPlugin.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
        msg.ack();
    } catch (err) {
        logPlugin.error('System Error in Error Persist', err);
        msg.reject();
    }
};

module.exports = createErrorPersist;