


var mapTransaction = function(dto, transaction, statusObject) {
        try {
            transaction.transactionId = dto.transaction.transactionId;
            transaction.merchantID = dto.transaction.merchantId;
            transaction.terminalId = dto.transaction.terminalId;
            transaction.cashierId = dto.transaction.cashierId;
            transaction.payments = [];
            dto.transaction.payments.forEach(function(payment) {
                var dtoPayment = {};
                dtoPayment.uid = payment.uid;
                dtoPayment.transactionId = payment.transactionId;
                dtoPayment.merchantId = payment.merchantId;
                dtoPayment.terminalId = payment.terminalId;
                dtoPayment.cashierId = payment.cashierId;
                dtoPayment.dateTime = payment.dateTime;
                dtoPayment.type = payment.type;
                dtoPayment.amount = payment.amount;
                dtoPayment.tax = payment.tax;
                dtoPayment.creditCard = {};
                dtoPayment.creditCard.cardType = payment.creditCard.cardType;
                dtoPayment.creditCard.last4 = payment.creditCard.last4;
                dtoPayment.creditCard.authCode = payment.creditCard.authCode;

            transaction.payments.push(dtoPayment);

        });
            statusObject.success.push("mapPayment");


        } catch (err) {
            statusObject.isOK = false;
            statusObject[err] = {
                module: "transactionMap",
                error: {code: 400, message: "Payment DTO was not successfully created from Post Body"}

            }
        }
        return transaction;
    };

module.exports = mapTransaction;