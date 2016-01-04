var post = require('../lib/cloudElementsClient');
var configPlugin = require('posable-customer-config-plugin');
var err = null;
var logPlugin = require('posable-logging-plugin');
var paymentTypeMap = require('../lib/paymentTypeMap');
var depositAccount = require('../lib/depositAccount');

var handleRealTimePayment = function(msg) {
    try {
        var id = msg.body.internalID;
        logPlugin.debug(id);
    } catch (err) {
        logPlugin.debug('HandleRealTimePayment MSG ID Parsing', err);
        msg.nack();
        return err;
    }
    configPlugin.merchantLookup(id, function(err, merchant){
        try {
            if (err) throw err;
            if (merchant == undefined) merchant = {batchType: "fake"}; // for testing only
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");
                post();
                console.log("sending to type as a real time");
                paymentTypeMap(msg);
                console.log("sending to deposit as a real time");
                depositAccount(msg);
            } else {
                logPlugin.debug("Daily batch merchant");
                //what to do here?
                console.log("sending to type as a batch merchant");
                paymentTypeMap(msg);
                console.log("sending to deposit as a batch merchant");
                depositAccount(msg);
            }
        } catch (err) {
            logPlugin.debug('HandleRealTimePayment Merchant Lookup System Error', err);
            msg.nack();
        }
        msg.ack();
    });
};

module.exports = {

    handleRealTimePayment: handleRealTimePayment

};
