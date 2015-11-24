var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

//Need to filter by today's transactions only
//function today() {
//    return new Date();
//}

var paymentQuery = function() {
    try {
         Transaction.find({'merchantID': 'SampleID', 'transactionPayments.paymentType': 'cash'}, function (err, payments) {
             if (err) return err;

             console.log(payments);
             return payments;
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = paymentQuery();
