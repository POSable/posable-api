var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

//var visaArray;
//
//var visaCallback = function(err, docs) {
//    //console.log(docs);
//    visaArray = docs;
//    //console.log("i'm in the visa callback", visaArray);
//};

var paymentQuery = function(internalID, callback) {
    try {

        //var startDate = function(){
        //    '2015/01/24 22:14:44'
        //    //new Date(2015, 1, 24)
        //};
        //
        //var endDate = function() {
        //    '2016/01/25 22:14:44'
        //    //new Date(2015, 1, 26)
        //};

        var batchObject = {
            visa: 0,
            mastercard: 0,
            amex: 0,
            discover: 0,
            cash: 0,
            total: 0
        };

        var paymentCallback = function (err, docs) {

            docs.forEach(function(payment){




                    if(payment.cardType === 'visa') {
                        batchObject.visa += payment.amount;
                    } if(payment.cardType === 'mastercard') {
                        batchObject.mastercard += payment.amount;
                    } if(payment.cardType === 'amex') {
                        batchObject.amex += payment.amount;
                    } if(payment.cardType === 'discover') {
                        batchObject.discover += payment.amount;
                    }


            });

            //console.log(docs);

            callback(err, batchObject);

        };

        Payment.find({"dateTime": {"$gte": '1995-11-17T03:24:00', "$lt": '1995-13-17T03:24:00'}}).where({internalID: internalID}).exec(paymentCallback);



        //Transaction.find({internalID: internalID}, {'transactionPayments.cardType': "visa"}, {}, visaCallback);


         //var visa = Transactions.find({'merchantID': 'merchantID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'visa'}, callback);
         //var mastercard = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'mastercard'}, callback);
         //var amex = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'amex'}, callback);
         //var discover = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'discover'}, callback);
         //var cash = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'cash'}, callback);


        //return callback(undefined, batchArray);

    } catch (err) {
       logPlugin.error(err);
        return callback(err, undefined);
    }
};

module.exports = paymentQuery;


