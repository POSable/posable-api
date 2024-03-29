var invoiceProcedure = require('./invoiceProcedure');
var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(invoiceToBePosted){
        invoiceProcedure(invoiceToBePosted)
    })
};

var invoiceQuery = function() {
    try {
        Invoice.find({
                finalizeAt:
                    {
                        $lt: new Date()
                    },
                extPostID: null,
                paymentsSent: false
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
