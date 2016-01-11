var realTimePaymentMap = require('../lib/realTimeTransactionMap');
var post = require('../lib/cloudElementsClient');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var err = null;
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');

var handleRealTimePayment = function(msg) {
    try {
        var id = msg.body.internalID;
        // logPlugin.debug(id);
    } catch (err) {
        logPlugin.debug('HandleRealTimePayment MSG ID Parsing', err);
        msg.nack();
        return err;
    }
    configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
        try {

            if (err) throw err;
            if (merchant == undefined) merchant = {batchType: "fake"}; // for testing only
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");
                var typeMap = cardTypeMap(merchant);
                var depositObj = depositAccount(merchant);

                var cloudElemSR = realTimePaymentMap(msg, typeMap, depositObj);
            } else {
                console.log("batch merchant found");
            }
        } catch (err) {
            logPlugin.debug('HandleRealTimePayment Merchant Lookup System Error', err);
            msg.nack();
        }

        post(cloudElemSR, function(err){
            if(err)
                msg.nack();
            else
                msg.ack();
                console.log("the msg made it through post and ack");
        });
    });
};

module.exports = {

    handleRealTimePayment: handleRealTimePayment

};
