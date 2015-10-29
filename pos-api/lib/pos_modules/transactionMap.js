var Transaction = require('../../models/transaction').model;

var mapTransaction = function(dto, statusObject) {
        try {
            var transaction = new Transaction();
            transaction.transactionID = dto.transaction.transactionID;
            transaction.merchantID = dto.transaction.merchantID;
            transaction.terminalID = dto.transaction.terminalID;
            transaction.cashierID = dto.transaction.cashierID;
            dto.transaction.payments.forEach(function(paymentdto) {
                transaction.transactionPayments.push({
                    uid : paymentdto.uid,
                    transactionID : paymentdto.transactionID,
                    merchantID : paymentdto.merchantID,
                    terminalID : paymentdto.terminalID,
                    cashierID : paymentdto.cashierID,
                    dateTime : paymentdto.dateTime,
                    paymentType : paymentdto.paymentType,
                    amount : paymentdto.amount,
                    tax : paymentdto.tax,
                    cardType : paymentdto.creditCard.cardType,
                    last4 : paymentdto.creditCard.last4,
                    authCode : paymentdto.creditCard.authCode

                })
            });
        } catch (err) {
            console.log(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "transactionMap",
                error: {code: 400, message: "Transaction DB Map was not successfully completed from Post Body"}
            }
        }
        return transaction;
    };

module.exports = mapTransaction;