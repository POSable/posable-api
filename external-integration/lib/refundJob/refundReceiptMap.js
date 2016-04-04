var refundReceiptMap = function(merchConfig, refundPayment) {
    var payTypeID = refundPayment.paymentType + 'ID';
    var depositID;

    if (payTypeID === 'cashID') { depositID = 'cashAccountID'; }
    else if (payTypeID === 'checkID') { depositID = 'checkAccountID'; }
    else { depositID = 'creditAccountID'; } // Assigns both credit AND debit to creditAccountID

    return {
        "customerRef": {
            "value": merchConfig.accountingCustomerID
        },
        "depositToAccountRef": {
            "value": merchConfig[depositID]
        },
        "line": [],
        "paymentMethodRef": {
            "value": merchConfig[payTypeID]
        }
    }
};

module.exports = refundReceiptMap;