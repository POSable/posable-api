var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');
var invoiceMerchantSearch = require('../common/merchantSearch');

var paymentReceiptProcedure = function (responsefromCloudElem) {
    // Create CE paymentReceipt (all sync)
    // This is kicked off by the successful Invoice Post and we pass the response to get the
    // Invoice ID to link the payment
    try {

        //need to find the correct mapping here and not hard code.

        var id = 1;

        invoiceMerchantSearch(id, function(err, merchant){
            if (err) {
                // Error connecting to database
                logPlugin.error(err);
            } else {
                var paymentReceipt = paymentReceiptMap(responsefromCloudElem);

                //postProcedure(merchant, paymentReceipt, function(err, externalPost) {
                //    if (err) {
                //        logPlugin.error(err);
                //    } else {
                //        logPlugin.debug('ExternalPost: ' + externalPost.externalPostID + 'Posted and updated successfully');
                //    }
                //});
            }
        });



    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};

module.exports = paymentReceiptProcedure;