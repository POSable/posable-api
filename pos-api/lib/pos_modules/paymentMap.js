var mapPayment = function(dto, payment, statusObject) {
        try {
            payment.cardType = dto.creditCard.cardType;
            payment.amount = dto.amount;
            payment.last4OfCard = dto.creditCard.last4;
            payment.authorizationCode = dto.creditCard.authCode;
            payment.tax = dto.tax;
            payment.terminalID = dto.terminalId;
            payment.merchantID = dto.merchantId;
            payment.transactionType = dto.type;
            payment.netEPaySN = dto.uid;
            payment.userId = dto.cashierId;

            statusObject.success.push("mapPayment");

            return payment;

        } catch (error) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "paymentMap",
                error: {message: "Payment DTO was not successfully created from Post Body"}
            };
            return payment;
        }

    };

module.exports = mapPayment;