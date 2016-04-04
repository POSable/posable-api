var logPlugin = require('posable-logging-plugin');
var ExternalPost = require('./../../models/externalPost').model;
var refundReceiptMap = require('./refundReceiptMap');
var refundMerchantSearch = require('../../lib/common/merchantSearch');
var Refund = require('../../models/refund').model;


var createRefundExtPost = function(refund, callback){
    refundMerchantSearch(refund.internalID, function(err, merchConfig) {
        if (err) {
            return callback(err, null);
        } else {
            refund.refundPayments.forEach(function(refundPayment){
                var newRefundReceipt = refundReceiptMap(merchConfig, refundPayment);

                refund.refundItems.forEach(function(refundItem){
                    if (refundItem.amount > refundPayment.amount) {
                        addReceiptLine(refundItem.type, refundPayment.amount);
                        refundItem.amount = refundItem.amount - refundPayment.amount;
                        refundPayment.amount = 0;
                    } else {
                        addReceiptLine(refundItem.type, refundItem.amount);
                        refundPayment.amount = refundPayment.amount - refundItem.amount;
                        refundItem.amount = 0;
                    }

                    // Helper, placed here to have access to loop variables
                    function addReceiptLine(lineType, lineAmount){
                        var typeID = lineType + "LineItemID";
                        newRefundReceipt.line.push({
                            "amount": lineAmount,
                            "description": "TransactionID: " + refundItem.transactionID,
                            "detailType": "SALES_ITEM_LINE_DETAIL",
                            "salesItemLineDetail": {
                                "itemRef": { "value": merchConfig[typeID] }
                            }
                        });
                    }
                });

                var externalPost = new ExternalPost();

                externalPost.internalID = refund.internalID;
                externalPost.postBody = newRefundReceipt;
                externalPost.type = "Refund";

                externalPost.save(function (err, externalPost){
                    if (err) {
                        logPlugin.error(err);
                        return callback(err, null);
                    } else {
                        logPlugin.debug('External post for refund saved successfully');
                        markRefundAsProcessed(refund);
                        return callback(null, externalPost);
                    }
                });
            });
        }
    });
};

// Helper
function markRefundAsProcessed(refund) {
    Refund.findByIdAndUpdate({_id: refund._id}, {$set: {processed: true}}, function (err, refund) {
        if (err) {
            logPlugin.error(err);
            throw err;  // Error finding/updating refund, throw error to catch block
        } else {
            logPlugin.debug('Refund: '+ refund._id +'- marked as processed');
        }
    });
}

module.exports = createRefundExtPost;