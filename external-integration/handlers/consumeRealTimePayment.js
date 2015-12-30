var post = require('../lib/cloudElementsClient');
var configPlugin = require('posable-customer-config-plugin');
var err = null;
var logPlugin = require('posable-logging-plugin');

var handleRealTimePayment = function(msg, callback) {
    try {
        var id = msg.body.internalID;
        logPlugin.debug(id);
    } catch (err) {
        logPlugin.debug('HandleRealTimePayment MSG ID Parsing', err);
        msg.nack();
        return callback(err);
    }
    configPlugin.merchantLookup(id, function(err, merchant){
        try {
            if (err) throw err;
            if (merchant == undefined) var merchant = {}; // for testing only
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");
                post();
            } else {
                logPlugin.debug("Daily batch merchant");
                //what to do here?
            }
        } catch (err) {
            logPlugin.debug('HandleRealTimePayment Merchant Lookup System Error', err);
            msg.nack();
            return callback(err);
        }
        msg.ack();
        return callback(err, id);
    });
};

module.exports = {

    handleRealTimePayment: handleRealTimePayment

};
