var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

//Need to filter by today's transactions only
//function today() {
//    return new Date();
//}

//this prolly turns into mastercardQuery and then gets pushed into a summayObject for rabbit publish

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
        console.log(err);
    }
};

module.exports = paymentQuery;


