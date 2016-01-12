var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(msg) {
        try {
            logPlugin.debug('Starting Transaction Property Mapping');
            var transaction = new Transaction();
            transaction.requestID = msg.correlationId;
            transaction.transactionID = msg.body.data.transactionID;
            transaction.merchantID = msg.body.data.merchantID;
            transaction.terminalID = msg.body.data.terminalID;
            transaction.cashierID = msg.body.data.cashierID;
            transaction.dateTime = msg.body.data.dateTime;
            msg.body.data.transactionPayments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    uid : paymentdto.uid,
                    dateTime : paymentdto.dateTime,
                    paymentType : paymentdto.paymentType,
                    amount : paymentdto.amount,
                    tax : paymentdto.tax,
                    cardType : paymentdto.cardType,
                    last4 : paymentdto.last4,
                    authCode : paymentdto.authCode
                })
            });
        } catch (err) {
            logPlugin.debug('System error in mapTransaction');
            logPlugin.error(err);
            return undefined;
        }
        logPlugin.debug('Transaction Property Mapping Finished');
        return transaction;
    };

module.exports = mapTransaction;