var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var timedService = require('./timedService');
var realTime = require('./realTime');
var logPlugin = require('posable-logging-plugin');

var batchType = function() {
    try {
        var id;
        configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {

            if (merchant.batchType == "real-time") {
                logPlugin.info("Real-time merchant");

            } else {
                logPlugin.info("Daily batch merchant");


            }
        });

    } catch (err) {
        logPlugin.error(err);
        msg.reject();
    }
};

module.exports = batchType;
