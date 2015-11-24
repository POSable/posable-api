var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

var paymentQuery = function() {
    try {
         Transaction.find({'transactionPayments.paymentType': 'cash'}, function (err, payments) {
             if (err) return err;

             console.log(payments);
             return payments;
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = paymentQuery();
