var cardTypeMap = require('./cardTypeMap');
var qbDepositAccount = require('./qbDepositAccount');
var qbRealTimeTransactionMap = require('./qbRealTimeTransactionMap');
var postProcedure = require('./postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var qbRequestMap = function (msg, merchant) {
    // Create CE sales receipt (all sync)
    try {
        var type = cardTypeMap(merchant);
        var depositObj = qbDepositAccount(merchant);
        var salesReceipt = qbRealTimeTransactionMap(msg, type, depositObj);

        postProcedure(msg, merchant, salesReceipt, function(err) {
            if (err) {
                handleError(msg, err);
            } else {
                wascallyRabbit.rabbitDispose(msg, null);
            }
        });

    } catch (err) {
        throw err;
    }
};


module.exports = qbRequestMap;