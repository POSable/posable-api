var realTimeTransactionMap = require('../lib/realTimeTransactionMap');
var configPlugin = require('posable-customer-config-plugin');
var logPlugin = require('posable-logging-plugin');
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');
var post = require('../lib/cloudElementsClient');
var rabbitDispose = require('../lib/rabbitMsgDispose');


var handleRealTimeTransaction = function(msg) {
    var id = msg.body.internalID;
    if(id == undefined){
        var idErr = new Error('Msg internalID is undefined.  Msg is rejected');
        idErr.deadLetter = true;
        logPlugin.error(idErr);
        rabbitDispose(msg, idErr);
    } else {
        logPlugin.debug("Found merchant ID " + id);
        configPlugin.merchantLookup(id, function(err, merchant) { //pass logger
            if (err) {
                logPlugin.error(err);
                rabbitDispose(msg, err);
            } else {
                logPlugin.debug('Merchant Lookup finished');
                processMerchant(merchant)
            }
        });
    }

    function processMerchant(merchant){
        if (merchant == undefined) merchant = {batchType: "fake"}; // for testing only
        if (merchant.batchType === "real-time") {
            logPlugin.debug("Real-time merchant");

            var typeMap = cardTypeMap(merchant);
            var depositObj = depositAccount(merchant);

            //console.log("ok", depositObj);
            var cloudElemSR = realTimeTransactionMap(msg, typeMap, depositObj);

            postToCE(cloudElemSR, merchant);
        } else {
            console.log("batch merchant found");
        }
    }

    function postToCE(cloudElemSR, merchant){
        post(cloudElemSR, merchant, function (err, salesReceipt) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug("the msg made it through post and ack");
            }
            rabbitDispose(msg, err);
        });
    }
}

module.exports = {

    handleRealTimeTransaction: handleRealTimeTransaction

};
