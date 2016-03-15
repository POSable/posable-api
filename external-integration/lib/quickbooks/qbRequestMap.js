var cardTypeMap = require('./../cardTypeMap');
var qbDepositAccount = require('./qbDepositAccount');
var qbRealTimeTransactionMap = require('./qbRealTimeTransactionMap');
var postProcedure = require('./../postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var qbInvoiceRealTimeMap = require('./qbInvoiceRealTimeMap');

var handleError = function(msg, err){
    err.deadLetter = true;
    logPlugin.error(err);
    wascallyRabbit.rabbitDispose(msg, err);
};

var qbRequestMap = function (msg, merchant) {
    // Create CE sales receipt (all sync)
    try {
        //var type = cardTypeMap(merchant);
        //var depositObj = qbDepositAccount(merchant);
        //var salesReceipt = qbRealTimeTransactionMap(msg, type, depositObj);
        var qbInvoice = qbInvoiceRealTimeMap(msg);

        postProcedure(msg, merchant, qbInvoice, function(err, externalPost) {
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


module.exports = qbRequestMap;