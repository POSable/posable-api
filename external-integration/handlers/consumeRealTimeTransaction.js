var realTimeTransactionMap = require('../lib/realTimeTransactionMap');
var env = require('../common').config();
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);
var cardTypeMap = require('../lib/cardTypeMap');
var depositAccount = require('../lib/depositAccount');
var post = require('../lib/cloudElementsClient');
var rabbitDispose = require('../lib/rabbitMsgDispose');

var handleSyncError = function(err){
    err.deadLetter = true;
    logPlugin.error(err);
    rabbitDispose(msg, err);
};


var handleRealTimeTransaction = function(msg) {
    var id = msg.body.internalID;
    if(id == undefined){
        var idErr = new Error('Msg internalID is undefined.  Msg is rejected');
        handleSyncError(idErr);
    } else {
        logPlugin.debug("Found merchant ID " + id);
        configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
            if (err) {
                handleSyncError(err);
            } else {
                logPlugin.debug('Merchant Lookup finished');
                processMerchant(merchant)
            }
        });
    }

    function processMerchant(merchant){
        try {
            if (merchant == undefined) throw new Error("Merchant not found");
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");

                var typeMap = cardTypeMap(merchant);
                var depositObj = depositAccount(merchant);

                var cloudElemSR = realTimeTransactionMap(msg, typeMap, depositObj);

                postToCE(cloudElemSR, merchant);

            } else {
                logPlugin.debug("batch merchant found");
                rabbitDispose(msg, err);
            }
        } catch(err) {
            handleSyncError(err);
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
};

module.exports = {

    handleRealTimeTransaction: handleRealTimeTransaction

};
