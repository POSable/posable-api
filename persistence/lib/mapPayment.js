var Payment = require('../models/payment').model;

var mapPayment = function(msg) {
        try {

            var payment = new Payment();
            payment.uid = msg.uid;
            payment.transactionID = msg.transactionID;
            payment.merchantID = msg.merchantID;
            payment.terminalID = msg.terminalID;
            payment.cashierID = msg.cashierID;
            payment.dateTime = msg.dateTime;
            payment.paymentType = msg.paymentType;
            payment.amount = msg.amount;
            payment.tax = msg.tax;
            payment.cardType = msg.creditCard.cardType;
            payment.last4 = msg.creditCard.last4;
            payment.authCode = msg.creditCard.authCode;

            //statusObject.success.push("mapPayment");

            return payment;

        } catch (err) {
            console.log(err);
            //statusObject.isOK = false;
            //statusObject['error'] = {
            //    module: "transactionMap",
            //    error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            //}
        }
    return payment;
};

module.exports = mapPayment;