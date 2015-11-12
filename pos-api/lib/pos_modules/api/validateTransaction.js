var validator = require('validator');
var createValPayObj = require('./validatePayment');
//var logPOS = require('../../../logs/sendLogMessage');


function createValTransObj(transactionDTO) {
    var valObject = {
        payload: transactionDTO.transaction,
        message: {},
        payments: transactionDTO.transaction.payments,
        isValid: true
    };

    valObject.valTransactionID = function() {
        if (!validator.isAlphanumeric(this.payload.transactionID)) {
            this.message.transactionID = 'Invalid transaction ID';
            this.isValid = false; }
        return this; };

    valObject.valMerchantID = function() {
        if (!validator.isAlphanumeric(this.payload.merchantID)) {
            this.message.merchantID = 'Invalid merchant ID';
            this.isValid = false; }
        return this; };

    valObject.valTerminalID = function() {
        if (!validator.isAlphanumeric(this.payload.terminalID)) {
            this.message.terminalID = 'Invalid terminal ID';
            this.isValid = false; }
        return this; };

    valObject.valCashierID = function() {
        if (!validator.isAlphanumeric(this.payload.cashierID)) {
            this.message.cashierID = 'Invalid cashier ID';
            this.isValid = false; }
        return this; };

    valObject.valTransPayments = function(statusObject) {
        this.payments.forEach(function(payment) {
            var eachPayment = createValPayObj(payment);
            eachPayment.validatePayment(statusObject);
        });
        return this;
    };

    valObject.validateTransaction = function(statusObject) {
        try {
            this.valTransactionID();
            this.valMerchantID();
            this.valTerminalID();
            this.valCashierID();
            this.valTransPayments(statusObject);

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
            //logPOS(err);
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
