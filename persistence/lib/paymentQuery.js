var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);

var visaArray;

var visaCallback = function(err, docs) {
    visaArray = docs;
    console.log("i'm in the visa callback", visaArray);
};

var paymentQuery = function(internalID, callback) {
    try {

        Transaction.find({internalID: internalID}).where({cardType: "visa"}).exec(visaCallback);

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