var Transaction = require('../models/transaction').model;
var Payment = require('../models/payment').model;
var logPlugin = require('posable-logging-plugin');
// Date formatting helper
function dateObject (stringDate) { return new Date(stringDate) }

var mapTransaction = function(msg) {
    logPlugin.debug('Starting Transaction Property Mapping');

    try {
        var transaction = new Transaction();

        transaction.requestID = msg.correlationId;
        transaction.dateTime = dateObject(msg.body.data.dateTime);
        transaction.transactionID = msg.body.data.transactionID;
        transaction.internalID = msg.body.internalID;
        transaction.isVoid = msg.body.data.isVoid;
        transaction.isRefund = msg.body.data.isRefund;
        transaction.merchantID = msg.body.data.merchantID;
        transaction.registerID = msg.body.data.registerID;
        transaction.cashierID = msg.body.data.cashierID;
        transaction.discounts = msg.body.data.discounts;
        transaction.subtotal = msg.body.data.subtotal;
        transaction.taxes = msg.body.data.taxes;
        transaction.total = msg.body.data.total;
        transaction.customer = msg.body.data.customer;
        transaction.inventoryItems = msg.body.data.inventoryItems;
        transaction.batchID = null;
        //transaction.customField = msg.body.data.customField;

        msg.body.data.transactionPayments.forEach(function(paymentdto) {
            var payment = new Payment();

            payment.paymentID = paymentdto.paymentID;
            payment.paymentType = paymentdto.paymentType;
            payment.amount = paymentdto.amount;
            payment.cardType = paymentdto.cardType;
            payment.last4 = paymentdto.last4;
            payment.authCode = paymentdto.authCode;
            //payment.customField = paymentdto.customField;
            transaction.transactionPayments.push(payment);
        });

        logPlugin.debug('Transaction mapping successful');
        return transaction;

    } catch (err) {
        logPlugin.error(err);
        throw new Error('Failed transaction mapping'); // <-- Throws error to handler
    }
};

module.exports = mapTransaction;
