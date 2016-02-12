var getCardID = require('./getCardID');

var xeroRealTimeTransactionMap = function(msg, paymentMap, depositObj) {

    var array = msg.body.data.transactionPayments;
    var sale = {};
    var lineItems = [];
    var total = 0;

    array.forEach(function(payment) {
        var cardID = getCardID(payment, paymentMap);
        if (!Number.isSafeInteger(cardID)) {
            throw new Error("Unknown Card Type Found for : " + payment.cardType);
        }

        total += payment.amount;

        sale = {
            "TaxType": "NONE",
            "ItemCode": "Bacon",
            "TaxAmount": 0,
            "Description": "Bacon",
            "AccountCode": "4000",
            "LineAmount": 2,
            "Quantity": 1,
            "UnitAmount": 2,
            "LineItemID": ""
        };
        lineItems.push(sale)
    });

    var salesReceipt = {
        "LineItems": lineItems,
        "Reference": "",
        "HasAttachments": false,
        "BankAccount": {
            "AccountID": "8aaeb073-f199-420c-a205-1cbe77864bac",
            "Name": "Blah Blah Account"
        },
        "Date": new Date(),
        "LineAmountTypes": "Exclusive",
        "CurrencyCode": "USD",
        "Type": "SPEND",
        "TotalTax": 0,
        "Total": total

    };

    return salesReceipt;

};

module.exports = xeroRealTimeTransactionMap;