var logPlugin = require('posable-logging-plugin');


var sumPaymentsByType = function (paymentsArray) {
    try {
        var visaObj = {};
        var visaSum = 0;
        var masterCardSum = 0;
        var masterCardObj = {};
        var amexSum = 0;
        var amexObj = {};
        var discoverSum = 0;
        var discoverObj = {};
        var creditSum = 0;
        var creditObj = {};
        var ebtSum = 0;
        var ebtObj = {};
        var cashSum = 0;
        var cashObj = {};
        var checkSum = 0;
        var checkObj = {};

        var summedArray = [];

        paymentsArray.forEach(function(payment) {

            if(payment.paymentType === 'Visa') {
                visaSum += payment.amount;
                visaObj.visaSum = visaSum;
                summedArray.push(visaObj);
            }if(payment.paymentType === 'Mastercard') {
                masterCardSum += payment.amount;
                masterCardObj.masterCardSum = masterCardSum;
                summedArray.push(masterCardObj);
            }if(payment.paymentType === 'AMEX') {
                amexSum += payment.amount;
                amexObj.amexSum = amexSum;
                summedArray.push(amexObj);
            }if(payment.paymentType === 'Discover') {
                discoverSum += payment.amount;
                discoverObj.discoverSum = discoverSum;
                summedArray.push(discoverObj);
            }if(payment.paymentType === 'Debit' || payment.paymentType === 'Credit') {
                creditSum += payment.amount;
                creditObj.creditSum = creditSum;
                summedArray.push(creditObj);
            }if(payment.paymentType === 'FSA' || payment.paymentType === 'EBT') {
                ebtSum += payment.amount;
                ebtObj.ebtSum = ebtSum;
                summedArray.push(creditObj);
            }if(payment.paymentType === 'Cash') {
                cashSum += payment.amount;
                cashObj.cashSum = cashSum;
                summedArray.push(cashObj);
            }if(payment.paymentType === 'Check') {
                checkSum += payment.amount;
                checkObj.checkSum = checkSum;
                summedArray.push(checkObj);
            }
        });
        logPlugin.debug('Summed Payments Array : ' + JSON.stringify(summedArray));
        return summedArray;

    } catch (err) {
        logPlugin.error(err);
        throw err;
    }
};


module.exports = sumPaymentsByType;
