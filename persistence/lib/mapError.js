/**
 * Created by davidabramowitz on 1/12/16.
 */
var Error = require('../models/error').model;
var logPlugin = require('posable-logging-plugin');

var mapError = function(msg) {
    try {
        logPlugin.debug('Starting Error Property Mapping');
        var errorMsg = new Error();
        errorMsg.server = msg.server;
        errorMsg.application = msg.application;
        errorMsg.data = msg.data;

    } catch (err) {
        logPlugin.debug('System error in mapError');
        logPlugin.error(err);
        return undefined;
    }
    logPlugin.debug('Error Property Mapping Finished');
    return errorMsg;
};

module.exports = mapError;