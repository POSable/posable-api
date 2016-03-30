var logPlugin = require('posable-logging-plugin');
var Payment = require('../../models/payment').model;
var paymentReceiptProcedure = require('./paymentReceiptProcedure');

var paymentQuery = function(merchConfig, qbInvoiceID, internalInvoiceID) {
    try {
        Payment.aggregate(
            [
                {
                    $match:
                    {
                        "invoiceID" : internalInvoiceID.toString()
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
                    paymentReceiptProcedure(result, qbInvoiceID, merchConfig)
                }
            }
        );

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = paymentQuery;
