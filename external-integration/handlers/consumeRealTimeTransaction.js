var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var postProcedure = require('../lib/postProcedure');

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var handleRealTimeTransaction = function(msg) {
    var id = msg.body.internalID;
    if(id === undefined){
        var idErr = new Error('Msg internalID is undefined.  Msg is rejected from Real Time msg Handler');
        handleSyncError(msg, idErr);
    } else {
        logPlugin.debug("Found internal ID : " + id);
        configPlugin.merchantLookup(id, logPlugin, function(err, merchant) {
            try {
                postProcedure(msg, function (err) {
                    if (err) {
                        handleError(msg, err);
                    } else {
                        wascallyRabbit.rabbitDispose(msg, null);
                    }
                });
            } catch (err) {
                logPlugin.error(err);
            }
        });    

    }

    function processMerchant(merchant){
        try {
            if (merchant === undefined) throw new Error("Merchant not found");
            if (merchant.batchType === "real-time") {
                logPlugin.debug("Real-time merchant");

                var typeMap = cardTypeMap(merchant);
                var depositObj = depositAccount(merchant);

                var cloudElemSR = realTimeTransactionMap(msg, typeMap, depositObj);

                postToCE(cloudElemSR, merchant);

            } else {
                logPlugin.debug("batch merchant found");
                wascallyRabbit.rabbitDispose(msg, err);
            }
        } catch(err) {
            handleSyncError(msg, err);
        }
    }

    function postToCE(cloudElemSR, merchant){
        post(cloudElemSR, merchant, function (err, salesReceipt) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug("the msg made it through post and ack");
            }
            wascallyRabbit.rabbitDispose(msg, err);
        });
    }
};

module.exports = {
    handleRealTimeTransaction: handleRealTimeTransaction
};

