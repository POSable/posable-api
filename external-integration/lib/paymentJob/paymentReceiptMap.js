var paymentReceiptMap = function(responsefromCloudElem) {

    var payment = {
        "customerRef": {  //need to map in the value but this is the proper post object
            "value": "1"
        },
        "depositToAccountRef": {
            "value": "4"
        },
        "line": [
            {
                "amount": 50.00,
                "linkedTxn": [
                    {
                        "txnId": "469",
                        "txnType": "Invoice"
                    }
                ]
            }
        ],
        "paymentMethodRef": {
            "value": "3"
        },
        "totalAmt": 50.00,
        "txnDate": "2016-03-18"
    };
    return payment;
};


module.exports = paymentReceiptMap;