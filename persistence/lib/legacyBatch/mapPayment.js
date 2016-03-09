var Payment = require('../../models/payment').model;
var Transaction = require('../../models/transaction').model;
var logPlugin = require('posable-logging-plugin');

var mapPayment = function(msg) {
    try {
        logPlugin.debug('Start Payment Mapping');
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
            console.log(msg.body);
            payment.cardType = msg.body.data.cardType;
            payment.last4 = msg.body.data.last4;
            payment.authCode = msg.body.data.authCode; }

        transaction.transactionPayments.push(payment);
        logPlugin.debug('Successful Mapping');
        return transaction;

    } catch (err) {
        logPlugin.debug('Failed Mapping');
        logPlugin.error(err);
       return undefined;
    }
};

module.exports = mapPayment;