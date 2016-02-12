var cardTypeMap = require('./cardTypeMap');
var xeroDepositAccount = require('./xeroDepositAccount');
var XeroRealTimeTransactionMap = require('./XeroRealTimeTransactionMap');
var postProcedure = require('./postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var xeroRequestMap = function (msg, merchant) {
    // Create CE sales receipt (all sync)
    try {
        var type = cardTypeMap(merchant);
        var depositObj = xeroDepositAccount(merchant);
        var salesReceipt = XeroRealTimeTransactionMap(msg, type, depositObj);

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


module.exports = xeroRequestMap;