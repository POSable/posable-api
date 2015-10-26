var validator = require('validator');

//custom extensions
validator.extend('isAuthCode', function(str){
    return /(\d{3})/.test(str);
});

validator.extend('isLast4', function(str){
    return /(\d{4})/.test(str);
});

function valCardType(payload) {
    if (!validator.isIn(payload.payment.creditCard.cardType, ['visa', 'mastercard', 'discover', 'amex'])) {
        message.cardType = 'Invalid card type';
        isValid = false;
    }
}

function valCurrency (payload) {
    if (!validator.isCurrency(payload.payment.amount)) {
        message.amount = "Invalid amount";
        isValid = false;
    }
}

function valLast4(payload) {
    if (!validator.isLast4(payload.payment.creditCard.last4)) {
        message.last4OfCard = 'Last 4 invalid';
        isValid = false;
    }
}

function valAuthCode(payload) {
    if (!validator.isAuthCode(payload.payment.creditCard.authCode)) {
        message.authCode = 'Invalid authorization code';
        isValid = false;
    }
}

function valTax(payload) {
    if (!validator.isCurrency(payload.payment.tax)) {
        message.tax = 'Invalid tax amount';
        isValid = false;
    }
}

function valTerminalID(payload) {
    if (!validator.isAlphanumeric(payload.payment.terminalId)) {
        message.terminalID = 'Invalid terminal ID';
        isValid = false;
    }
}

function valMerchantID(payload) {
    if (!validator.isAlphanumeric(payload.payment.merchantId)) {
        message.merchantID = 'Invalid merchant ID';
        isValid = false;
    }
}

function valPaymentType(payload) {
    if (!validator.isIn(payload.payment.type, ['cash', 'credit'])) {
        message.type = 'Invalid payment type';
        isValid = false;
    }
}

function valUID(payload) {
    if (!validator.isAlphanumeric(payload.payment.uid)) {
        message.uid = 'Invalid UID';
        isValid = false;
    }
}

function valCashierID(payload) {
    if (!validator.isAlphanumeric(payload.payment.cashierId)) {
        message.cashierID = 'Invalid cashier ID';
        isValid = false;
    }
}

function validatePayment(DTO, statusObject) {
    try {
        var message = {};
        var isValid = true;
        valCardType(DTO);
        valCurrency(DTO);
        valLast4(DTO);
        valAuthCode(DTO);
        valTax(DTO);
        valTerminalID(DTO);
        valMerchantID(DTO);
        valPaymentType(DTO);
        valUID(DTO);
        valCashierID(DTO);

        if (!isValid) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: 'payment validation',
                error: {code: 400, message: message}
            };
            return false;
        } else {
            statusObject.success.push('validated');
            return true;
        }
    } catch (err) {
        statusObject.isOK = false;
        statusObject['error'] = {
            module: 'payment validation',
            error: {code: 400, message: "System error caused Validation to fail"}
        };
        return false;
    }
}


module.exports = validatePayment;
