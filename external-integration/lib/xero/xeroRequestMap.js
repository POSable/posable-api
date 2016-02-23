var cardTypeMap = require('./../cardTypeMap');
var xeroDepositAccount = require('./xeroDepositAccount');
var XeroRealTimeTransactionMap = require('./xeroRealTimeTransactionMap');
var postProcedure = require('./../postProcedure');
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

        postProcedure(msg, merchant, salesReceipt, function(err, externalPost) {
            if (err) {
                handleError(msg, err);
            } else {
                logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
                wascallyRabbit.rabbitDispose(msg, null);
            }
        });

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};


module.exports = xeroRequestMap;