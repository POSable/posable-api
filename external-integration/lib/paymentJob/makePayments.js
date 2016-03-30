var logPlugin = require('posable-logging-plugin');
var Payment = require('../../models/payment').model;

var makePayments = function(msg, invoice) {
    logPlugin.debug('Starting makePayment procedure');

    var transactionID = msg.body.data.transactionID;
    var paymentsArray = msg.body.data.transactionPayments;
    
    paymentsArray.forEach(function(paymentItem) {

        if(paymentItem.paymentType !== "Gift") {
            var payment = new Payment();

            payment.amount = paymentItem.amount;
            payment.invoiceID = invoice._id;
            payment.transactionID = transactionID;
            payment.cloudElemID = null;

            if(paymentItem.paymentType === "Credit") {
                payment.paymentType = paymentItem.cardType;
            } else {
                payment.paymentType = paymentItem.paymentType;
            }

            payment.save(function (err) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('Payment was saved');
                }
            });
        }
    });

};

module.exports = makePayments;