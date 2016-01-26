var Transaction = require('../models/transaction').model;

var getResults = function(internalID, batchID, paymentCallback) {

    Transaction.update({ internalID: internalID, batchID: null }, { $set: {batchID: batchID} }, { multi: true }, function(err, raw) {
        if (err) logPlugin.error("The transaction update response Error from mongo is : " + err);
        console.log("The transactions have been updated for ID : " + internalID + " and batchID : " + batchID + " raw : " + JSON.stringify(raw));
    });


    Transaction.aggregate(
        [
            {
                $match: 
                {
                    //async issue? bc update not done running?    ^^^^^^^^
                    //batchID: batchID

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