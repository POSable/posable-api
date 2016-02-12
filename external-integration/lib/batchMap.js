var post = require('./cloudElementsClient');
var logPlugin = require('posable-logging-plugin');
var deposit = require('./qbDepositAccount');
var getCardID = require('./getCardID');

var batchMap = function(msg, paymentMap, depositObj) {

    var batch = msg.body.data;

    //var cardID = getCardID(batch, paymentMap);
    //if(!Number.isSafeInteger(cardID)) {
    //    throw new Error("Unknown Card Type Found for : " + batch);
    //}

    salesReceipt = {
            "line": [
            {
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": batch.visa,
                "salesItemLineDetail": {
                    "unitPrice": batch.visa,
                    "itemRef": {
                        "name": "Visa",
                        "value": paymentMap.visaID
                    },
                    "taxCodeRef": {
                        "value": "NON"
                    },
                    "qty": 1
                },
                "lineNum": 1,
                "id": "1",
                "linkedTxn": [],
                "customField": []
            },
            {
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": batch.mastercard,
                "salesItemLineDetail": {
                    "unitPrice": batch.mastercard,
                    "itemRef": {
                        "name": "Mastercard",
                        "value": paymentMap.mastercardID
                    },
                    "taxCodeRef": {
                        "value": "NON"
                    },
                    "qty": 1
                },
                "lineNum": 2,
                "id": "2",
                "linkedTxn": [],
                "customField": []
            },
            {
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": batch.amex,
                "salesItemLineDetail": {
                    "unitPrice": batch.amex,
                    "itemRef": {
                        "name": "AMEX",
                        "value": paymentMap.amexID
                    },
                    "taxCodeRef": {
                        "value": "NON"
                    },
                    "qty": 1
                },
                "lineNum": 3,
                "id": "3",
                "linkedTxn": [],
                "customField": []
            },
            {
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": batch.discover,
                "salesItemLineDetail": {
                    "unitPrice": batch.discover,
                    "itemRef": {
                        "name": "Discover",
                        "value": paymentMap.discoverID
                    },
                    "taxCodeRef": {
                        "value": "NON"
                    },
                    "qty": 1
                },
                "lineNum": 4,
                "id": "4",
                "linkedTxn": [],
                "customField": []
            },
            {
                "detailType": "SUB_TOTAL_LINE_DETAIL",
                "amount": batch.total,
                "linkedTxn": [],
                "customField": []
            }
        ],
            "depositToAccountRef": {
            "name": depositObj.depositAccountName,
                "value": depositObj.depositAccountID
        },
            "totalAmt": batch.total,
            "balance": 0,
            "sparse": true,
            "applyTaxAfterDiscount": false,
            "txnDate": new Date()
        };


    return salesReceipt;

};

module.exports = batchMap;