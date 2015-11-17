var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;

var mapPayment = function(msg) {
        try {
            //console.log(msg.body.data.transaction.payments);
            var transaction = new Transaction();
            var payment = new Payment();
            transaction.transactionID =  msg.body.data.transaction.transactionID;
            transaction.merchantID = msg.body.data.transaction.merchantID;
            transaction.terminalID = msg.body.data.transaction.terminalID;
            transaction.cashierID = msg.body.data.transaction.cashierID;
            payment.uid = msg.uid;
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