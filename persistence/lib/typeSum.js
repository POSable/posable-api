var paymentQuery = require('./paymentQuery');
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');
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
        logPlugin.info(result);
        //inside callback block return result will need push to timed service
        //Publish msg to Rabbit using the wascally wrapper
        // Also need to handle error returned from wascally. If one.
        wascallyRabbit.raiseNewDailySumEvent(result).then(console.log('Summation sent to RabbitMQ'))
        };
    paymentQuery(callback);
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};

module.exports = typeSum;