var mapPayment = function(dto, payment, statusObject) {
        try {
            payment.cardType = dto.payment.creditCard.cardType;
            payment.amount = dto.payment.amount;
            payment.last4OfCard = dto.payment.creditCard.last4;
            payment.authorizationCode = dto.payment.creditCard.authCode;
            payment.tax = dto.payment.tax;
            payment.terminalID = dto.payment.terminalId;
            payment.merchantID = dto.payment.merchantId;
            payment.transactionType = dto.payment.type;
            payment.netEPaySN = dto.payment.uid;
            payment.userId = dto.payment.cashierId;

            statusObject.success.push("mapPayment");

            return payment;

        } catch (error) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "mapPayment",
                error: {message: "Payment DTO was not successfully created from Post Body"}
            };
            return payment;
        }

    };

module.exports = mapPayment;