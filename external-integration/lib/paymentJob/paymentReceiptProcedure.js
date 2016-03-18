var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var paymentReceiptMap = require('./paymentReceiptMap');

var invoiceProcedure = function () {
    // Create CE paymentReceipt (all sync)
    try {
        var paymentReceipt = paymentReceiptMap();

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

module.exports = invoiceProcedure;