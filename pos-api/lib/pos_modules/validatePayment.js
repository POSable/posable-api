var validator = require('validator');

//custom extensions
validator.extend('isAuthCode', function(str){
    return /(\d{3})/.test(str); });

validator.extend('isLast4', function(str){
    return /(\d{4})/.test(str); });


function createValPayObj(paymentDTO) {
    var valObject = {
        payload: paymentDTO,
        message: {},
        isValid: true
    };

    valObject.valCardType = function() {
        if (!validator.isIn(this.payload.creditCard.cardType, ['visa', 'mastercard', 'discover', 'amex'])) {
            this.message.cardType = 'Invalid card type';
            this.isValid = false; }
        return this; };

    valObject.valAmount = function() {
        if (!validator.isCurrency(this.payload.amount)) {
            this.message.amount = 'Invalid amount';
            this.isValid = false; }
        return this; };

    valObject.valLast4 = function() {
        if (!validator.isLast4(this.payload.creditCard.last4)) {
            this.message.last4 = 'Last 4 of card invalid';
            this.isValid = false; }
        return this; };

    valObject.valAuthCode = function() {
        if (!validator.isAuthCode(this.payload.creditCard.authCode)) {
            this.message.authCode = 'Invalid authorization code';
            this.isValid = false; }
        return this; };

    valObject.valTax = function() {
        if (!validator.isCurrency(this.payload.tax)) {
            this.message.tax = 'Invalid tax amount';
            this.isValid = false; }
        return this; };

    valObject.valTerminalID = function() {
        if (!validator.isAlphanumeric(this.payload.terminalId)) {
            this.message.terminalID = 'Invalid terminal ID';
            this.isValid = false; }
        return this; };

    valObject.valMerchantID = function() {
        if (!validator.isAlphanumeric(this.payload.merchantId)) {
            this.message.merchantID = 'Invalid merchant ID';
            this.isValid = false; }
        return this; };

    valObject.valCashierID = function() {
        if (!validator.isAlphanumeric(this.payload.cashierId)) {
            this.message.cashierID = 'Invalid cashier ID';
            this.isValid = false; }
        return this; };

    valObject.valPaymentType = function() {
        if (!validator.isIn(this.payload.type, ['cash', 'credit'])) {
            this.message.paymentType = 'Invalid payment type';
            this.isValid = false; }
        return this; };

    valObject.valUID = function() {
        if (!validator.isAlphanumeric(this.payload.uid)) {
            this.message.uid = 'Invalid UID';
            this.isValid = false; }
        return this; };

    valObject.validatePayment = function(statusObject) {
        try {
            this.valCardType();
            this.valAmount();
            this.valLast4();
            this.valAuthCode();
            this.valTax();
            this.valMerchantID();
            this.valCashierID();
            this.valUID();

            if (!this.isValid) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'payment validation',
                    error: {code: 400, message: this.message}
                };
            } else {
                statusObject.success.push('validated');
            }
        } catch (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: 'payment validation',
                error: {code: 400, message: 'System error caused payment validation to fail'}
            };
        }
    };
    return valObject;
}

module.exports = createValPayObj;
