var paymentReceiptMap = function(merchConfig, cloudElemID, typeSum) {
    console.log(typeSum);
    var payTypeID = typeSum._id.paymentType + 'ID';
    var depositID;

    if (payTypeID === 'cashID') { depositID = 'cashAccountID'; }
    else if (payTypeID === 'checkID') { depositID = 'checkAccountID'; }
    else { depositID = 'creditAccountID'; } // Assigns both credit AND debit to creditAccountID


    console.log("*******", payTypeID, "  ", depositID);
    var line = [];

    var lineDetail = {

        "amount": typeSum.amount,
        "linkedTxn": [
            {
                "txnId": cloudElemID,  //this is without the pipe 0
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
            "value": merchConfig[depositID]
        },
        "line": line,
        "paymentMethodRef": {
            "value": merchConfig[payTypeID]
        },
        "totalAmt": typeSum.amount
    };
    console.log(paymentMap);
    return paymentMap;
};

module.exports = paymentReceiptMap;