var Transaction = require('../../../models/transaction').model;
var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(dto, statusObject) {
        try {
            var transaction = new Transaction();
            var dateTime;
            if (dto.transaction.transactionDateTime.date) {
                dateTime = dto.transaction.transactionDateTime.date + " " + dto.transaction.transactionDateTime.time;
            } else {
                dateTime = dto.transaction.transactionDateTime.combinedDateTime;
            }
            transaction.transactionID = dto.transaction.transactionID;
            transaction.merchantID = dto.transaction.merchantID;
            transaction.terminalID = dto.transaction.terminalID;
            transaction.cashierID = dto.transaction.cashierID;
            transaction.dateTime = dateTime;
            dto.transaction.payments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    uid : paymentdto.uid,
                    dateTime : dateTime,
                    paymentType : paymentdto.paymentType,
                    amount : paymentdto.amount,
                    tax : paymentdto.tax,
                    cardType : paymentdto.creditCard.cardType,
                    last4 : paymentdto.creditCard.last4,
                    authCode : paymentdto.creditCard.authCode
                })
            });
        } catch (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "transactionMap",
                error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            }
        }
        return transaction;
    };

module.exports = mapTransaction;