var logPlugin = require('posable-logging-plugin');
var Refund = require('../../models/refund').model;
var createRefundExtPost = require('./createRefundExtPost');

var processRefunds = function(refundArray) {
    refundArray.forEach(function(refundToBeProcessed){
        createRefundExtPost(refundToBeProcessed, function(err) {
            if (err) { throw new Error('Error creating external posts from refund: '+ refundToBeProcessed._id); }
        });
    });
};

var refundQuery = function() {
    Refund.find({ processed: false }, {}, function(err, refundArray) {
        if (err) {
            logPlugin.error(err);
            throw err;  // Throw error to timer, kills service
        } else {
            processRefunds(refundArray);
        }
    });
};

module.exports = refundQuery;