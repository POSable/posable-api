var post = require('./cloudElementsClient');
var logPlugin = require('posable-logging-plugin');
var deposit = require('./depositAccount');
var getCardID = require('./getCardID');

var realTimeTransactionMap = function(msg, paymentMap, depositObj) {

    var array = msg.body.data.transactionPayments;
    var sale = {};
    var line = [];
    var total = 0;

    array.forEach(function(payment){

        var cardID = getCardID(payment, paymentMap);
        if(!Number.isSafeInteger(cardID)) {
            throw new Error("Unknown Card Type Found for : " + payment.cardType);
        }

        total += payment.amount;

        sale = {
            "detailType": "SALES_ITEM_LINE_DETAIL",
            "amount": payment.amount,
            "salesItemLineDetail": {
                "unitPrice": payment.amount,
                "itemRef": {
                    "name": payment.cardType,
                    "value": cardID
                },
                "taxCodeRef": {
                    "value": "NON"
                },
                "qty": 1
            },
            "lineNum": 1,
            //"id": 1598,
            "linkedTxn": [],
            "customField": []
        };
        line.push(sale);
    });

    line.push({
        "detailType": "SUB_TOTAL_LINE_DETAIL",
        "amount": total,
        "linkedTxn": [],
        "customField": []
    });


    salesReceipt = {
        "line": line,
        "depositToAccountRef": {
            "name": depositObj.depositAccountName,
            "value": depositObj.depositAccountID
        },
        "totalAmt": total,
        "balance": 0,
        "sparse": true,
        "applyTaxAfterDiscount": false,
        "txnDate": "2015-12-7T00:00:00Z"
    };
    return salesReceipt;


};

module.exports = realTimeTransactionMap;