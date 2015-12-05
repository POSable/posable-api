var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

//Need to filter by today's transactions only
//function today() {
//    return new Date();
//}

var paymentQuery = function(callback) {
    try {
         Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'credit'}, callback);
    } catch (err) {
        console.log(err);
    }
};

module.exports = paymentQuery;


