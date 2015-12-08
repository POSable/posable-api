var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

//Need to filter by today's transactions only
//function today() {
//    return new Date();
//}

//this prolly turns into mastercardQuery and then gets pushed into a summayObject for rabbit publish

var paymentQuery = function(callback) {
    try {
         Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit', 'transactionPayments.cardType': 'mastercard'}, callback);
    } catch (err) {
        console.log(err);
    }
};

module.exports = paymentQuery;


