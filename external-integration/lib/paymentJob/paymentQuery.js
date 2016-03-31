var paymentAggregation = require('./paymentAggregation');
var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(invoiceToBeAggregated){
        paymentAggregation(invoiceToBeAggregated)
    })
};

var paymentQuery = function() {
    try {
        Invoice.find({
                extPostID: !null,
                //join extPost.ceid !null
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

module.exports = paymentQuery;
