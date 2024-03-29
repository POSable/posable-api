var logPlugin = require('posable-logging-plugin');
var Payment = require('../../models/payment').model;
var paymentReceiptProcedure = require('./paymentReceiptProcedure');

var paymentQuery = function(invoiceToBeAggregated) {
    var internalID = invoiceToBeAggregated.internalID;
    var internalInvoiceID = invoiceToBeAggregated._id;
    var cloudElemID = invoiceToBeAggregated.cloudElemID;

    try {
        Payment.aggregate(
            [
                {
                    $match:
                    {
                        "invoiceID" : invoiceToBeAggregated._id.toString()
                    }
                },
                {
                    $group :
                    {
                        _id:
                        {
                            paymentType : "$paymentType"
                        },
                        amount :
                        {
                            $sum : "$amount"
                        }
                    }
                }
            ], function(err, result) {
                if( err ) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('Found Payments to be sent. Results : ' + result);
                    paymentReceiptProcedure(result, internalID, cloudElemID, internalInvoiceID)
                }
            }
        );

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = paymentQuery;
