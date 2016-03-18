var postProcedure = require('./../cloudElem/postProcedure');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
var invoiceMap = require('./invoiceMap');

var invoiceProcedure = function () {
    // Create CE invoice (all sync)
    try {
        var invoice = invoiceMap();

        postProcedure(msg, merchant, invoice, function(err, externalPost) {
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