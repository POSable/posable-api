var Transaction = require('../models/transaction').model;

var getResults = function(internalID, paymentCallback) {
    Transaction.aggregate(
        [
            {
                $match:
                {
                    "dateTime":
                    {
                        "$gte": new Date("1995-11-17T03:24:00Z"),
                        "$lt": new Date("1995-12-18T03:24:00Z")
                    },
                    "internalID": internalID.toString()
                }
            },
            {
                $unwind : "$transactionPayments"
            },
            {
                $project :
                {
                    "transactionPayments.paymentType" : true,
                    "transactionPayments.cardType" : true,
                    "transactionPayments.amount" : true
                }
            },
            {
                $group :
                {
                    _id:
                    {
                        paymentType : "$transactionPayments.paymentType",
                        cardType : "$transactionPayments.cardType"
                    },
                    //count :
                    //{
                    //    $sum : 1
                    //},
                    amount :
                    {
                        $sum : "$transactionPayments.amount"
                    }
                }
            }
        ], paymentCallback

    );

};

module.exports = getResults;