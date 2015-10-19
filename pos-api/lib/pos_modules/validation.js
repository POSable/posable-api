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

var Val = function( req, res, transactionDTO) {
    this.payload = transactionDTO.dto.payment;
    this.message = {};
    this.isValid = true;
    this.req = req;
    this.res = res;
};

    Val.prototype.valCardType = function() {
        if (validator.isIn(this.payload.creditCard.cardType, ['visa', 'mastercard', 'discover', 'amex', 'example visa'])){
        } else {
            this.message.cardType = 'Invalid card type';
            this.isValid = false;
        }
    };

    Val.prototype.valCurrency = function() {
        if (validator.isCurrency(this.payload.amount)) {
        } else {
            this.message.amount = "Invalid amount";
            this.isValid = false;
        }
    };

    Val.prototype.valLast4 = function() {
        if (validator.isLast4(this.payload.creditCard.last4)) {
        } else {
            this.message.last4OfCard = 'Last 4 invalid';
            this.isValid = false;
        }
    };

    Val.prototype.valAuthCode = function() {
        if (validator.isAuthCode(this.payload.creditCard.authCode)) {
        } else {
            this.message.authCode = 'Invalid authorization code';
            this.isValid = false;
        }
    };

    Val.prototype.valTax = function() {
        if (validator.isCurrency(this.payload.tax)) {
        } else {
            this.message.tax = 'Invalid tax amount';
            this.isValid = false;
        }
    };

    Val.prototype.valTerminalID = function() {
        if (validator.isAlphanumeric(this.payload.terminalId)) {
        } else {
            this.message.terminalID = 'Invalid terminal ID';
            this.isValid = false;
        }
    };

    Val.prototype.valMerchantID = function() {
        if (validator.isAlphanumeric(this.payload.merchantId)) {
        } else {
            this.message.merchantID = 'Invalid merchant ID';
            this.isValid = false;
        }
    };

    Val.prototype.valPaymentType = function() {
        if (validator.isIn(this.payload.type, ['cash', 'credit'])) {
        } else {
            this.message.type = 'Invalid payment type';
            this.isValid = false;
        }
    };

    Val.prototype.valUID = function() {
        if (validator.isAlphanumeric(this.payload.uid)) {
        } else {
            this.message.uid = 'Invalid UID';
            this.isValid = false;
        }
    };

    Val.prototype.valCashierID = function() {
        if (validator.isAlphanumeric(this.payload.cashierId)) {
        } else {
            this.message.cashierID = 'Invalid cashier ID';
            this.isValid = false;
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

        //return checkMessages(this.message);
        if (!this.isValid) {
            console.log("not Val")
            this.res.status(422);
            this.res.json(this.message);
        }
        return this.isValid;
    };

module.exports = Val;
