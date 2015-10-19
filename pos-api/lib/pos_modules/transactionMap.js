var mapTransaction = function(dto, transaction) {

console.log(dto);
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

        return true;
    };

module.exports = mapTransaction;