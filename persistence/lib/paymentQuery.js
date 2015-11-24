var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
//var paymentSum;

var paymentQuery = function() {
    try {
        var rawReturn = Payment.find({ 'paymentType' : 'credit' }, function (err, payments) {
            if (err) return err;
            console.log(payments);
        });
        console.log(rawReturn);
    } catch (err) {
        console.log(err);
    }
    return rawReturn;
};

module.exports = paymentQuery();