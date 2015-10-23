var validator = require('validator');

//custom extensions
validator.extend('isAuthCode', function(str){
    return /(\d{3})/.test(str);
});

validator.extend('isLast4', function(str){
    return /(\d{4})/.test(str);
});

var Val = function(DTO) {
    this.payload = DTO;
    this.message = {};
    this.isValid = true;
};

    Val.prototype.valCardType = function() {
        if (!validator.isIn(this.payload.creditCard.cardType, ['visa', 'mastercard', 'discover', 'amex'])) {
            this.message.cardType = 'Invalid card type';
            this.isValid = false; }};

    Val.prototype.valCurrency = function() {
        if (!validator.isCurrency(this.payload.amount)) {
            this.message.amount = "Invalid amount";
            this.isValid = false; }};

    Val.prototype.valLast4 = function() {
        if (!validator.isLast4(this.payload.creditCard.last4)) {
            this.message.last4OfCard = 'Last 4 invalid';
            this.isValid = false; }};

    Val.prototype.valAuthCode = function() {
        if (!validator.isAuthCode(this.payload.creditCard.authCode)) {
            this.message.authCode = 'Invalid authorization code';
            this.isValid = false; }};

    Val.prototype.valTax = function() {
        if (!validator.isCurrency(this.payload.tax)) {
            this.message.tax = 'Invalid tax amount';
            this.isValid = false; }};

    Val.prototype.valTerminalID = function() {
        if (!validator.isAlphanumeric(this.payload.terminalId)) {
            this.message.terminalID = 'Invalid terminal ID';
            this.isValid = false; }};

    Val.prototype.valMerchantID = function() {
        if (!validator.isAlphanumeric(this.payload.merchantId)) {
            this.message.merchantID = 'Invalid merchant ID';
            this.isValid = false; }};

    Val.prototype.valPaymentType = function() {
        if (!validator.isIn(this.payload.type, ['cash', 'credit'])) {
            this.message.type = 'Invalid payment type';
            this.isValid = false; }};

    Val.prototype.valUID = function() {
        if (!validator.isAlphanumeric(this.payload.uid)) {
            this.message.uid = 'Invalid UID';
            this.isValid = false; }};

    Val.prototype.valCashierID = function() {
        if (!validator.isAlphanumeric(this.payload.cashierId)) {
            this.message.cashierID = 'Invalid cashier ID';
            this.isValid = false; }};

    Val.prototype.validateValues = function() {
        this.valCardType();
        this.valCurrency();
        this.valLast4();
        this.valAuthCode();
        this.valTax();
        this.valTerminalID();
        this.valMerchantID();
        this.valPaymentType();
        this.valUID();
        this.valCashierID();
    };

    Val.prototype.valPayment = function(statusObject) {
        this.validateValues();
        if (this.isValid) {
            statusObject.success.push('validated');
        } else {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: 'validation',
                error: {message: this.message}
            }
        }
    };

module.exports = Val;
