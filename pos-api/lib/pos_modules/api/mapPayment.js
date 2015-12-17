//var Payment = require('../../../models/payment').model;
var logPlugin = require('posable-logging-plugin');


var mapPayment = function(dto, statusObject) {
    try {
        var payment = {};
        //payment = new Payment();
        payment.uid = dto.uid;
        payment.dateTime = dto.dateTime;
        payment.amount = dto.amount;
        payment.tax = dto.tax;
        payment.paymentType = dto.paymentType;

        if (dto.paymentType == 'credit') {
            payment.cardType = dto.creditCard.cardType;
            payment.last4 = dto.creditCard.last4;
            payment.authCode = dto.creditCard.authCode; }

        statusObject.success.push("mapPayment");

    } catch (err) {
        logPlugin.error(err);
        statusObject.isOK = false;
        statusObject['error'] = {
            module: "paymentMap",
            error: {message: "Payment DTO was not successfully created from Post Body"}
        };
    }
    return payment;
};

module.exports = mapPayment;