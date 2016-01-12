var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');
var env = require('../common').config();
var configPlugin = require('posable-customer-config-plugin')(env['mongoose_connection']);



//Need to filter by today's transactions only
//function today() {
//    return new Date();
//}
var paymentQuery = function(callback) {
    try {
         var visa = Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'visa'}, callback);
         var mastercard = Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'mastercard'}, callback);
         var amex = Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'amex'}, callback);
         var discover = Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'discover'}, callback);
         var cash = Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'cash'}, callback);

         var batch = {
             visa: visa,
             mastercard: mastercard,
             amex: amex,
             discover: discover,
             cash: cash,
             total: visa + amex + amex + discover + cash
         };
        return batch

    } catch (err) {
       logPlugin.error(err);
        return undefined;
    }
};

module.exports = paymentQuery;