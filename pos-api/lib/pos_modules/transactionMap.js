
var mapTransaction = function(dto, transaction, statusObject) {
        try {
            transaction.transactionID = dto.transaction.transactionID;
            transaction.merchantID = dto.transaction.merchantID;
            transaction.terminalID = dto.transaction.terminalID;
            transaction.cashierID = dto.transaction.cashierID;
            transaction.transactionPayment = [];
            //dto.transaction.payments.forEach(function(payment) {
            //    var transactionPayment = {};
            //    transactionPayment.uid = payment.uid;
            //    transactionPayment.transactionId = payment.transactionId;
            //    transactionPayment.merchantId = payment.merchantId;
            //    transactionPayment.terminalId = payment.terminalId;
            //    transactionPayment.cashierId = payment.cashierId;
            //    transactionPayment.dateTime = payment.dateTime;
            //    transactionPayment.paymentType = payment.paymentType;
            //    transactionPayment.amount = payment.amount;
            //    transactionPayment.tax = payment.tax;
            //    transactionPayment.creditCard = {};
            //    transactionPayment.cardType = payment.creditCard.cardType;
            //    transactionPayment.last4OfCard = payment.creditCard.last4;
            //    transactionPayment.authorizationCode = payment.creditCard.authCode;
            //transaction.payments.push(dtoPayment);

            statusObject.success.push("mapPayment");
            console.log(transaction);

        } catch (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "transactionMap",
                error: {code: 400, message: "Transaction DTO was not successfully created from Post Body"}
            }
        }
        return transaction;
    };

module.exports = mapTransaction;