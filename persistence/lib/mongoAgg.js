var Transaction = require('../models/transaction').model;

var getResults = function(internalID, batchID, paymentCallback) {

    Transaction.update({ internalID: internalID, batchID: null }, { $set: {batchID: batchID} }, { multi: true }, function(err, raw) {
        if (err) {logPlugin.error("The transaction update response Error from mongo is : " + err)}
        else {
            console.log("The transactions have been updated for ID : " + internalID + " and batchID : " + batchID + " raw : " + JSON.stringify(raw));
            mongoAgg(batchID, paymentCallback);
        }
    });

    var mongoAgg = function(batchID, paymentCallback) {


        Transaction.aggregate(
            [
                {
                    $match:
                    {
                        "batchID" : batchID.toString()
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



};

module.exports = getResults;