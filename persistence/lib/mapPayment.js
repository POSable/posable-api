var Payment = require('../models/payment').model;
var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');

var mapPayment = function(msg) {
    try {
        //console.log(msg.body.data.transaction.payments);
        var transaction = new Transaction();
        var payment = new Payment();
        transaction.transactionID =  msg.body.data.transactionID;
        transaction.merchantID = msg.body.data.merchantID;
        transaction.terminalID = msg.body.data.terminalID;
        transaction.cashierID = msg.body.data.cashierID;
        payment.uid = msg.body.data.uid;
        payment.dateTime = msg.body.data.dateTime;
        payment.paymentType = msg.body.data.paymentType;
        payment.amount = msg.body.data.amount;
        payment.tax = msg.body.data.tax;

        if (msg.body.data.paymentType === 'credit') {
            payment.cardType = msg.body.data.creditCard.cardType;
            payment.last4 = msg.body.data.creditCard.last4;
            payment.authCode = msg.body.data.creditCard.authCode; }

        transaction.transactionPayments.push(payment);

        return transaction;

    } catch (err) {
        logPlugin.error(err);
       return undefined;
    }
};

module.exports = mapPayment;