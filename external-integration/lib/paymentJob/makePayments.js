var logPlugin = require('posable-logging-plugin');
var Payment = require('../../models/payment').model;

var makePayments = function(msg, invoice) {
    logPlugin.debug('Starting makePayment procedure');

    var transactionID = msg.body.data.transactionID;
    var paymentsArray = msg.body.data.transactionPayments;
    
    paymentsArray.forEach(function(paymentItem) {
        var payment = new Payment();

        payment.amount = paymentItem.amount;
        payment.invoiceID = invoice._id;
        payment.paymentType = paymentItem.paymentType;
        payment.transactionID = transactionID;
        payment.cardType = paymentItem.cardType;

        payment.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Payment was saved');
            }
        });

    });

};

module.exports = makePayments;