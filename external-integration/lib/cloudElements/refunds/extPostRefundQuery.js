var extPostRefundProcedure = require('./extPostRefundProcedure');
var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('../../../models/externalPost').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(extPostRefundToBePosted){
        extPostRefundProcedure(extPostRefundToBePosted)
    })
};

var refundQuery = function() {
    try {
        ExternalPost.find({
                type: "Refund",
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

module.exports = refundQuery;