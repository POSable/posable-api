var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('./../../models/externalPost').model;


var finishInvoiceProcedure = function(merchant, invoice, callback) {

    var externalPost = new ExternalPost();

    externalPost.merchantID = merchant.internalID;
    externalPost.postBody = invoice;
    externalPost.type = "Invoice";

    externalPost.save(function (err, externalPost) {
        if (err) {
            logPlugin.error(err);
            return callback(err, null);
        } else {
            return callback(null, externalPost._id);
        }
    });
};

module.exports = finishInvoiceProcedure;