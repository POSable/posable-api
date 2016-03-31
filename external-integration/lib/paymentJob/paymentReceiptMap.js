var paymentReceiptMap = function(merchConfig, extPostID, typeSum) {

    var line = [];

        var lineDetail = {

            "amount": typeSum.amount,
            "linkedTxn": [
                {
                    "txnId": extPostID,  //this is without the pipe 0
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
        "totalAmt": typeSum.amount
    };
    console.log(paymentMap);
    return paymentMap;
};

module.exports = paymentReceiptMap;