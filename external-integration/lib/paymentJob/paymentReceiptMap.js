var paymentReceiptMap = function(merchConfig, qbInvoiceID, paymentsArray) {

    var lineDetail = {};
    var line = [];

    paymentsArray.forEach(function(payment) {



        lineDetail = {

            "amount": payment.amount,
            "linkedTxn": [
                {
                    "txnId": qbInvoiceID,
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
            "value": "3"  //add these into the insert statement and map --- quit slacking
        }
    };
    console.log(paymentMap);
    return paymentMap;
};


module.exports = paymentReceiptMap;