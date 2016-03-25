var paymentReceiptMap = function(merchConfig, qbInvoiceID, paymentsArray) {
    console.log(qbInvoiceID, typeof qbInvoiceID);

    var lineDetail = {};
    var line = [];

    paymentsArray.forEach(function(payment) {



        lineDetail = {

            "amount": payment.amount,
            "linkedTxn": [
                {
                    "txnId": "671",  //you are going to need to strip out the pipe 0
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
            "value": "4"
        },
        "line": line,
        "paymentMethodRef": {
            "value": "3"  //add these into the insert statement and map --- quit slacking
        },
        "totalAmt": 50.00 //add up total payments
    };
    console.log(paymentMap);
    return paymentMap;
};


module.exports = paymentReceiptMap;