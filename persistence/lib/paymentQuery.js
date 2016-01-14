var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

var visaArray;

var visaCallback = function(err, docs) {
    //console.log(docs);
    visaArray = docs;
    //console.log("i'm in the visa callback", visaArray);
};

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

        //Transaction.find(function (err, docs) { console.log(docs) });

        //Transaction.find({"dateTime": {"$gte": '2015/01/24 22:14:44', "$lt": '2016/01/25 22:14:44'}}, function (err, docs) { console.log(docs) });


        //Transaction.find({internalID: internalID}, {'transactionPayments.cardType': "visa"}, {}, visaCallback);


         //var visa = Transactions.find({'merchantID': 'merchantID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'visa'}, callback);
         //var mastercard = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'mastercard'}, callback);
         //var amex = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'amex'}, callback);
         //var discover = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'discover'}, callback);
         //var cash = Transactions.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'cash'}, callback);

         var batchArray = {
             visa: visaArray
             //mastercard: mastercard,
             //amex: amex,
             //discover: discover,
             //cash: cash,
             //total: visa + amex + amex + discover + cash
         };
        return callback(undefined, batchArray);

    } catch (err) {
       logPlugin.error(err);
        return callback(err, undefined);
    }
};

module.exports = paymentQuery;


