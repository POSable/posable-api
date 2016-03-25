var postPaymentProcedure = require('./../cloudElem/postPaymentProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');
var invoiceMerchantSearch = require('../common/merchantSearch');
var paymentQuery = require('./paymentQuery');

var paymentReceiptProcedure = function (paymentsArray, qbInvoiceID, merchConfig) {
    // This is kicked off by the successful Invoice Post Procedure and Payment Query
    try {
        console.log('333333333', paymentsArray);
        var paymentReceipt = paymentReceiptMap(merchConfig, qbInvoiceID, paymentsArray);

        postPaymentProcedure(merchConfig, paymentReceipt, function(err, externalPost) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
            }
        });


    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};


module.exports = paymentReceiptProcedure;

