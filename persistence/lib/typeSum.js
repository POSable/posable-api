var payments = require('./paymentQuery');

var typeSum = function() {
    try {
        var result = payments.forEach(function(payment){
                payment.reduce(function(prev, curr) {
                    return prev.amount + curr.amount
            })
        })

    } catch (err) {
        console.log(err);
    }
    return result;
//    return will be a publish event to RabbitMQ
};

module.exports = typeSum();