var Transaction = require('../models/transaction').model;

var getResults = function(internalID) {
    Transaction.aggregate(
        [
            {
                $unwind : "$transactionPayments"
            },
            //{
            //    $match:
            //    {
            //        "dateTime":
            //        {
            //            "$gte": "1995-11-17T03:24:00Z",
            //            "$lt": "1995-12-18T03:24:00Z"
            //        }
            //    }
            //},
            //{
            //    $match:
            //    {
            //        internalID: internalID
            //    }
            //},
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
        ], function(err, result) {
            if (err) {
                console.log("whoops");
            } else {
                console.log("queryresult : ", result);

            }
        }

    );

};

module.exports = getResults;