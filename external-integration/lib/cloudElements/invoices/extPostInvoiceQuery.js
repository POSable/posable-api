var extPostInvoiceProcedure = require('./extPostInvoiceProcedure');
var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('../../../models/externalPost').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(extPostInvoiceToBePosted){
        extPostInvoiceProcedure(extPostInvoiceToBePosted)
    })
};

var invoiceQuery = function() {
    try {
        ExternalPost.find({
                type: "Invoice",
                quickbooksID: null
            },
            {},
            function(err, result) {
                if( err ) {
                    logPlugin.error(err);
                } else {
                    //logPlugin.debug('Found invoices that need to be completed. Results : ' + result);
                    kickOffProcedure(result)
                }
            }

        )

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = invoiceQuery;