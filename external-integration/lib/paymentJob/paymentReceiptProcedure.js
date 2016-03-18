var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');

var paymentReceiptProcedure = function (responsefromCloudElem) {
    // Create CE paymentReceipt (all sync)
    // This is kicked off by the successful Invoice Post and we pass the response to get the
    // Invoice ID to link the payment
    try {
        var paymentReceipt = paymentReceiptMap(responsefromCloudElem);

        postProcedure(msg, merchant, paymentReceipt, function(err, externalPost) {
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