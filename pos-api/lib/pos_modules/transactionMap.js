var o2x = require('object-to-xml');

var sendError  = function (res, message, status) {
    res.status(status);
    if (res.req.headers['content-type'] === 'application/xml') {
        res.send(o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            error: message,
        }));
    } else {
        res.json({
            error: message,
        });
    }
};

var mapTransaction = function(dto, transaction, res) {
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

        } catch (error) {
            console.log(error)
            sendError(res, "Payload Body Error", 422);
        }

        return true;
    };

module.exports = mapTransaction;