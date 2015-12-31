var Transaction = require('../models/transaction').model;
var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(msg) {
        try {
            var transaction = new Transaction();
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
           logPlugin.error(err);
            return undefined;
            //statusObject.isOK = false;
            //statusObject['error'] = {
            //    module: "transactionMap",
            //    error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            //}
        }
        //console.log(transaction);
        return transaction;
    };

module.exports = mapTransaction;