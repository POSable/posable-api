var paymentQuery = require('./paymentQuery');
//console.log(payments);

var typeSum = function() {
    try {
        var result = 0;
        var callback = function(err, payments) {
        if (err) return err;

            payments.forEach(function(payment) {

                result += payment.transactionPayments.reduce(function (prev, curr) {
                    return prev + curr.amount;
                }, 0)

            });
        console.log(result);
        //inside callback block return result will need push to timed service
        };

    paymentQuery(callback);
    } catch (err) {
        console.log(err);
    }
};

module.exports = typeSum();