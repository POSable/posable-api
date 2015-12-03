var paymentQuery = require('./paymentQuery');
var wascallyRabbit = require('posable-wascally-wrapper');
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
        //Publish msg to Rabbit using the wascally wrapper
        wascallyRabbit.raiseNewDailySumEvent(result)
        };

    paymentQuery(callback);
    } catch (err) {
        console.log(err);
    }
};

module.exports = typeSum;