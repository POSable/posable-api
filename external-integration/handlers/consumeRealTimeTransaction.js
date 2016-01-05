var realTimeTransactionMap = require('../lib/realTimeTransactionMap');
var configPlugin = require('posable-customer-config-plugin');
var logPlugin = require('posable-logging-plugin');
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');
var post = require('../lib/cloudElementsClient');


var handleRealTimeTransaction = function(msg) {
    try {
        var id = msg.body.internalID;
        // logPlugin.debug(id);
    } catch (err) {
        logPlugin.debug('HandleRealTimeTransaction MSG ID Parsing', err);
        msg.nack();
        return err;
    }
    configPlugin.merchantLookup(id, function(err, merchant){
        try {
            if (err) throw err;
            if (merchant == undefined) merchant = {batchType: "fake"}; // for testing only
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");


                var typeMap = cardTypeMap(merchant);
                var depositObj = depositAccount(merchant);

                //console.log("ok", depositObj);
                var cloudElemSR = realTimeTransactionMap(msg, typeMap, depositObj);

            } else {
                console.log("batch merchant found");
            }
        } catch (err) {
            logPlugin.debug('HandleRealTimeTransaction Merchant Lookup System Error', err);
            msg.nack();
            return
        }



        post(cloudElemSR, merchant, function(err, salesReceipt){
            if(err) {
                msg.nack();

            } else {
                msg.ack();
                console.log("the msg made it through post and ack");
            }});

    });
};

module.exports = {

    handleRealTimeTransaction: handleRealTimeTransaction

};
