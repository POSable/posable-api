var cardTypeMap = require('./cardTypeMap');
var depositAccount = require('./qbDepositAccount');
var qbBatchMap = require('./qbBatchMap');
var postProcedure = require('./postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');

var handleSyncError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var qbBatchRequestMap = function (msg, merchant) {
    // Create CE sales receipt (all sync)
    try {
        var type = cardTypeMap(merchant);
        var depositObj = depositAccount(merchant);
        var salesReceipt = qbBatchMap(msg, type, depositObj);

        postProcedure(msg, merchant, salesReceipt, function(err) {
            if (err) {
                handleSyncError(msg, err);
            } else {
                wascallyRabbit.rabbitDispose(msg, null);
            }
        });

    } catch (err) {
        throw err;
    }
};


module.exports = qbBatchRequestMap;
