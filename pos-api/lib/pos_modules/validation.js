var validator = require('validator');

//custom extensions
validator.extend('isAuthCode', function(str){
    return /(\d{3})/.test(str);
});

validator.extend('isLast4', function(str){
    return /(\d{4})/.test(str);
});



function checkMessages (obj) {
    return !Object.keys(obj).length;
}

function sendMessages (obj) {
    //send valErrors to error handling
}

var Val = function(transactionDTO) {
    this.payload = transactionDTO.dto.payment;
    this.message = {};
};

    Val.prototype.valCardType = function() {
        if (validator.isIn(this.payload.creditCard.cardType, ['visa', 'mastercard', 'discover', 'amex'])){
            return true;
        } else {
            this.message.cardType = 'Invalid card type';
            return false;
        }
    };

    Val.prototype.valCurrency = function() {
        if (validator.isCurrency(this.payload.amount)) {
            return true;
        } else {
            this.message.amount = "Invalid amount";
            return false;
        }
    };

    Val.prototype.valLast4 = function() {
        if (validator.isLast4(this.payload.creditCard.last4)) {
            return true;
        } else {
            this.message.last4OfCard = 'Last 4 invalid';
            return false;
        }
    };

    Val.prototype.valAuthCode = function() {
        if (validator.isAuthCode(this.payload.creditCard.authCode)) {
            return true;
        } else {
            this.message.authCode = 'Invalid authorization code';
            return false;
        }
    };

    Val.prototype.valTax = function() {
        if (validator.isCurrency(this.payload.tax)) {
            return true;
        } else {
            this.message.tax = 'Invalid tax amount';
            return false;
        }
    };

    Val.prototype.valTerminalID = function() {
        if (validator.isAlphanumeric(this.payload.terminalId)) {
            return true;
        } else {
            this.message.terminalID = 'Invalid terminal ID';
            return false;
        }
    };

    Val.prototype.valMerchantID = function() {
        if (validator.isAlphanumeric(this.payload.merchantId)) {
            return true;
        } else {
            this.message.merchantID = 'Invalid merchant ID';
            return false;
        }
    };

    Val.prototype.valPaymentType = function() {
        if (validator.isIn(this.payload.type, ['cash', 'credit'])) {
            return true;
        } else {
            this.message.type = 'Invalid payment type';
            return false;
        }
    };

    Val.prototype.valUID = function() {
        if (validator.isAlphanumeric(this.payload.uid)) {
            return true;
        } else {
            this.message.uid = 'Invalid UID';
        }
    };

    Val.prototype.valCashierID = function() {
        if (validator.isAlphanumeric(this.payload.cashierId)) {
            return true;
        } else {
            this.message.cashierID = 'Invalid cashier ID';
        }
    };

    Val.prototype.paymentValidator = function() {
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

        var valErrors = {};
            valErrors.code = 422;
            valErrors.message = this.message;

        //sendMessages(valErrors);

        return checkMessages(this.message);
    };

module.exports = Val;
