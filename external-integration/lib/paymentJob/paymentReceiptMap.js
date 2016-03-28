var sumPaymentsByType = require('./sumPaymentsByType');

var paymentReceiptMap = function(merchConfig, qbInvoiceID, paymentsArray) {

    var lineDetail = {};
    var line = [];
    var total = 0;

    paymentsArray.forEach(function(typeSum) {

        var summedPayments = sumPaymentsByType(payment);

        total += typeSum.value;

        lineDetail = {

            "amount": typeSum.value,
            "linkedTxn": [
                {
                    "txnId": qbInvoiceID,  //this is without the pipe 0
                    "txnType": "Invoice"
                }
            ]
        };

        line.push(lineDetail);
    });


    var paymentMap = {
        "customerRef": {
            "value": merchConfig.accountingCustomerID
        },
        "depositToAccountRef": {
            "value": merchConfig.depositAccountID
        },
        "line": line,
        "paymentMethodRef": {
            "value": merchConfig.creditAccountID
        },
        "totalAmt": total
    };
    console.log(paymentMap);
    return paymentMap;
};


module.exports = paymentReceiptMap;