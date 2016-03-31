var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('./../../models/externalPost').model;


var finishPaymentProcedure = function(merchConfig, paymentReceipt, callback) {

    var externalPost = new ExternalPost();

    externalPost.merchantID = merchant.internalID;
    externalPost.postBody = paymentReceipt;
    externalPost.type = "Payment";

    externalPost.save(function (err, externalPost) {
        if (err) {
            logPlugin.error(err);
            return callback(err, null);
        } else {
            return callback(null, externalPost._id);
        }
    });
};

module.exports = finishPaymentProcedure;
