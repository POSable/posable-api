var postPaymentProcedure = require('./../cloudElem/postPaymentProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');
var invoiceMerchantSearch = require('../common/merchantSearch');
var paymentQuery = require('./paymentQuery');

var paymentReceiptProcedure = function (paymentsArray, qbInvoiceID, merchConfig) {
    // This is kicked off by the successful Invoice Post Procedure and Payment Query
    try {

        paymentsArray.forEach(function(payment) {
            var paymentReceipt = paymentReceiptMap(merchConfig, qbInvoiceID, payment);

            postPaymentProcedure(merchConfig, paymentReceipt, function(err, qbPaymentID) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('ExternalPost of Payment: ' + qbPaymentID + ' Posted and Updated successfully');
                }
            });
        });

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = paymentReceiptProcedure;

