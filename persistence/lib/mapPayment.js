var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

var mapPayment = function(msg) {
        try {
            var transaction = new Transaction();
            var payment = new Payment();
            payment.uid = msg.uid;
            transaction.transactionID = msg.transactionID;
            transaction.merchantID = msg.merchantID;
            transaction.terminalID = msg.terminalID;
            transaction.cashierID = msg.cashierID;
            payment.dateTime = msg.dateTime;
            payment.paymentType = msg.paymentType;
            payment.amount = msg.amount;
            payment.tax = msg.tax;
            payment.cardType = msg.creditCard.cardType;
            payment.last4 = msg.creditCard.last4;
            payment.authCode = msg.creditCard.authCode;
            transaction.transactionPayments.push(payment);

            return transaction;

        } catch (err) {
            console.log(err);
            //statusObject.isOK = false;
            //statusObject['error'] = {
            //    module: "transactionMap",
            //    error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            //}
        }
    return transaction;
};

module.exports = mapPayment;