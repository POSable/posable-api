var ErrorMsg = require('../models/error').model;
var logPlugin = require('posable-logging-plugin');

var mapError = function(msg) {
    logPlugin.debug('Starting Error Property Mapping');

    try {
        var errorMsg = new ErrorMsg();
        errorMsg.server = msg.body.server;
        errorMsg.application = msg.body.application;
        errorMsg.data = msg.body.data;

        logPlugin.debug('Error mapping successful');
        return errorMsg;

    } catch (err) {
        logPlugin.error(err);
        throw new Error('Failed error mapping'); // <-- Throws error to handler
    }
};

module.exports = mapError;