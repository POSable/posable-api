var extPostPaymentProcedure = require('./extPostPaymentProcedure');
var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('../../../models/externalPost').model;
var forEachAsync = require('forEachAsync').forEachAsync;

var kickOffProcedure = function(resultArray) {
    forEachAsync(resultArray, function(next, extPostPaymentToBePosted){
        extPostPaymentProcedure(extPostPaymentToBePosted, function(err, extObjID){
            if(err) {
                logPlugin.error(err)
            } else {
                next();
            }
        })
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