var RefundItem = require('../../models/refundItem').model;
var RefundPayment = require('../../models/refundPayment').model;
// Item & Payment models MUST be required BEFORE Refund model
var Refund = require('../../models/refund').model;
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');
var addRefundItems = require('./addRefundItems');
var addRefundPayments = require('./addRefundPayments');
var createRefundExtPost = require('./createRefundExtPost');


var refundPersistence = function(msg, merchConfig, callback) {
    try {
        logPlugin.debug('Starting refund persistence');

        var newRefund = new Refund();
        newRefund.internalID = merchConfig.internalID;
        newRefund.refundItems = [];
        newRefund.refundPayments = [];

        addRefundItems(msg, newRefund);
        addRefundPayments(msg, newRefund);
        newRefund.save(function(err, refund) {
            if (err) {
                return callback(err, null);
            } else {
                logPlugin.debug('Refund saved successfully');
                return callback(null, refund);
            }
        });

    } catch (err) {
        throw err; // Throw error back to handler to be deadLettered and logged
    }
};


module.exports = refundPersistence;