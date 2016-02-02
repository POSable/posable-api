var Transaction = require('../models/transaction').model;
var Payment = require('../models/payment').model;
var logPlugin = require('posable-logging-plugin');

var mapTransaction = function(msg) {
        try {
            var dateObject = function (stringDate) {

                return new Date(stringDate)
            };

            logPlugin.debug('Starting Transaction Property Mapping');
            var transaction = new Transaction();


            transaction.requestID = msg.correlationId;
            transaction.transactionID = msg.body.data.transactionID;
            transaction.merchantID = msg.body.data.merchantID;
            transaction.terminalID = msg.body.data.terminalID;
            transaction.cashierID = msg.body.data.cashierID;
            transaction.dateTime = dateObject(msg.body.data.dateTime);
            transaction.internalID = msg.body.internalID;
            transaction.batchID = null;
            msg.body.data.transactionPayments.forEach(function(paymentdto) {

                var payment = new Payment();

                payment.uid = paymentdto.uid;
                payment.dateTime = paymentdto.dateTime;
                payment.paymentType = paymentdto.paymentType;
                payment.amount = paymentdto.amount;
                payment.tax = paymentdto.tax;
                payment.cardType = paymentdto.cardType;
                payment.last4 = paymentdto.last4;
                payment.authCode = paymentdto.authCode;
                payment.transaction_id = transaction._id;
                payment.internalID = msg.body.internalID;

                transaction.transactionPayments.push(payment);

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
