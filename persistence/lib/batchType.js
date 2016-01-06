var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var timedService = require('./timedService');
var realTime = require('./realTime');
var logPlugin = require('posable-logging-plugin');

var batchType = function(msg) {
    try {
        var id = msg.body.internalID;
        configPlugin.merchantLookup(id, function(err, merchant){

            if (merchant.batchType == "real-time") {
                logPlugin.info("Real-time merchant");
                realTime();
                msg.ack();
            } else {
                logPlugin.info("Daily batch merchant");
                timedService();
                msg.ack();
            }
        });

    } catch (err) {
        logPlugin.error(err);
        msg.reject();
    }
};

module.exports = batchType;
