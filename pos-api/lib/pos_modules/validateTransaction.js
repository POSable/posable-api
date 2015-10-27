var validator = require('validator');

function createValTransObj(transactionDTO) {
    var valObject = {
        payload: transactionDTO,
        message: {},
        isValid: true
    };

    valObject.valTransactionID = function() {
        if (!validator.isAlphanumeric(payload.transactionId)) {
            this.message.transactionID = 'Invalid transaction ID';
            this.isValid = false; }
        return this; };

    valObject.valMerchantID = function() {
        if (!validator.isAlphanumeric(payload.merchantId)) {
            this.message.merchantID = 'Invalid merchant ID';
            this.isValid = false; }
        return this; };

    valObject.valTerminalID = function() {
        if (!validator.isAlphanumeric(payload.terminalId)) {
            this.message.terminalID = 'Invalid terminal ID';
            this.isValid = false; }
        return this; };

    valObject.valCashierID = function() {
        if (!validator.isAlphanumeric(payload.cashierId)) {
            this.message.cashierID = 'Invalid cashier ID';
            this.isValid = false; }
        return this; };

    valObject.validateTransaction = function(statusObject) {
        try {
            valTransactionID(DTO);
            valMerchantID(DTO);
            valTerminalID(DTO);
            valCashierID(DTO);

            if (!this.isValid) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'transaction validation',
                    error: {code: 400, message: this.message}
                };
            } else {
                statusObject.success.push('transaction validated');
            }
        } catch (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: 'transaction validation',
                error: {code: 400, message: 'System error caused transaction validation to fail'}
            };
        }
    };
    return valObject;
}

module.exports = createValTransObj;
