var paymentReceiptMap = function(merchConfig, qbInvoiceID, payment) {

    var line = [];

        var lineDetail = {

            "amount": payment.amount,
            "linkedTxn": [
                {
                    "txnId": qbInvoiceID,  //this is without the pipe 0
                    "txnType": "Invoice"
                }
            ]
        };

        line.push(lineDetail);

    var paymentMap = {
        "customerRef": {
            "value": merchConfig.accountingCustomerID
        },
        "depositToAccountRef": {
            "value": merchConfig.depositAccountID
        },
        "line": line,
        "paymentMethodRef": {
            "value": merchConfig.creditAccountID //fix Me........
        },
        "totalAmt": payment.amount
    };
    console.log(paymentMap);
    return paymentMap;
};

module.exports = paymentReceiptMap;