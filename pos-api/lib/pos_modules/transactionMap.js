
var mapPayment = function(dto, payment, statusObject) {
        try {
            transaction.cardType = dto.payment.creditCard.cardType;
            transaction.amount = dto.payment.amount;
            transaction.last4OfCard = dto.payment.creditCard.last4;
            transaction.authorizationCode = dto.payment.creditCard.authCode;
            transaction.tax = dto.payment.tax;
            transaction.terminalID = dto.payment.terminalId;
            transaction.merchantID = dto.payment.merchantId;
            transaction.transactionType = dto.payment.type;
            transaction.netEPaySN = dto.payment.uid;
            transaction.userId = dto.payment.cashierId;

            statusObject.success.push("mapPayment");

        } catch (error) {
            statusObject.isOK = false;
            statusObject[error] = {
                module: createPaymentDTO,
                error: {message: "Payment DTO was not successfully created from Post Body"}
            }
        }

    };

module.exports = mapPayment;