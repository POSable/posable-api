var getCardID = require('./../getCardID');

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
            "Description": "Bacon",
            "AccountCode": "4000",
            "Quantity": 1,
            "UnitAmount": 2
        };
        lineItems.push(sale)
    });

    var salesReceipt = {
        "LineItems": lineItems,
        "Contact" : {
            "ContactID": "bfb38ca8-a0fc-4f37-b48b-d46c303702ac"
        },
        "BankAccount": {
            "AccountID": "8aaeb073-f199-420c-a205-1cbe77864bac"

        },
        "Date": new Date(),
        "LineAmountTypes": "Exclusive",
        "Type": "SPEND"
    };


    return salesReceipt;

};

module.exports = xeroRealTimeTransactionMap;
