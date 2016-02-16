var cardTypeMap = require('./../cardTypeMap');
var xeroDepositAccount = require('./xeroDepositAccount');
var xeroBatchMap = require('./../quickbooks/qbBatchMap');
var postProcedure = require('./../postProcedure');
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
        var depositObj = xeroDepositAccount(merchant);
        var salesReceipt = xeroBatchMap(msg, type, depositObj);

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
