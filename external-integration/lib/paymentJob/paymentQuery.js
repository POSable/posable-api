var paymentAggregation = require('./paymentAggregation');
var logPlugin = require('posable-logging-plugin');
var Invoice = require('../../models/invoice').model;

var kickOffProcedure = function(resultArray) {
    resultArray.forEach(function(invoiceToBeAggregated){
        paymentAggregation(invoiceToBeAggregated)
    })
};

var paymentQuery = function() {
    try {
        db.invoices.aggregate(
            [
                {
                    $match:
                    {
                        paymentsSent: false,
                        extPostID:
                        {
                            $not: null
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: "external posts",
                        localField: "extPostID",
                        foreignField: "_id",
                        as: "post_docs"
                    }
                }
            ]
        )

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = paymentQuery;
