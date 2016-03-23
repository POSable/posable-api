var getCardID = function(payment, paymentMap) {

    var tempId = 0;

    if(payment.cardType === 'visa') {
        tempId = paymentMap.visaID;
    } if(payment.cardType === 'mastercard') {
        tempId =  paymentMap.mastercardID;
    } if(payment.cardType === 'amex') {
        tempId =  paymentMap.amexID;
    } if(payment.cardType === 'discover') {
        tempId =  paymentMap.discoverID;
    } if(payment.cardType === 'cash') {
        tempId =  paymentMap.cashID;
    }
    return parseInt(tempId);
};

module.exports = getCardID;