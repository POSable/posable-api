var postPaymentProcedure = require('./../cloudElem/postPaymentProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');
var invoiceMerchantSearch = require('../common/merchantSearch');

var paymentReceiptProcedure = function (merchConfig, externalPostID) {
    // This is kicked off by the successful Invoice Post Procedure
    try {

        var paymentReceipt = paymentReceiptMap(merchConfig, externalPostID);

        //postPaymentProcedure(merchant, paymentReceipt, function(err, externalPost) {
        //    if (err) {
        //        logPlugin.error(err);
        //    } else {
        //        logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
        //    }
        //});

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = paymentReceiptProcedure;