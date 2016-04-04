var extPostPaymentProcedure = require('./extPostPaymentProcedure');
var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('../../../models/externalPost').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(extPostPaymentToBePosted){
        extPostPaymentProcedure(extPostPaymentToBePosted)
    })
};

var paymentQuery = function() {
    try {
        ExternalPost.find({
                type: "Payment",
                extObjID: null
            },
            {},
            function(err, result) {
                if( err ) {
                    logPlugin.error(err);
                } else {
                    //logPlugin.debug('Found payments that need to be completed. Results : ' + result);
                    kickOffProcedure(result)
                }
            }

        )

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = paymentQuery;