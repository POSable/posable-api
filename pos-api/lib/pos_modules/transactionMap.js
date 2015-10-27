
var mapTransaction = function(dto, transaction, statusObject) {
        try {
            //transaction.cardType = dto.transaction.creditCard.cardType;
            //transaction.amount = dto.payment.amount;
            //transaction.last4OfCard = dto.payment.creditCard.last4;
            //transaction.authorizationCode = dto.payment.creditCard.authCode;
            //transaction.tax = dto.payment.tax;
            //transaction.terminalID = dto.payment.terminalId;
            //transaction.merchantID = dto.payment.merchantId;
            //transaction.transactionType = dto.payment.type;
            //transaction.netEPaySN = dto.payment.uid;
            //transaction.userId = dto.payment.cashierId;
            //
            //statusObject.success.push("mapPayment");

        } catch (error) {
            statusObject.isOK = false;
            statusObject[error] = {
                module: "transactionMap",
                error: {code: 400, message: "Payment DTO was not successfully created from Post Body"}
            }
        }

    };

module.exports = mapTransaction;