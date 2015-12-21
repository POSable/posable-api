var post = require('./cloudElementsClient');
var increment = require('./idIncrement');

var realTimeTransactionMap = function(msg) {
    try {

        var array = msg.body.data.transactionPayments;

        var sale = {};
        var line = [];
        var total = 0;

        array.forEach(function(payment){

            console.log(payment.amount);

            total += payment.amount;

            sale = {
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": payment.amount,
                "salesItemLineDetail": {
                    "unitPrice": payment.amount,
                    "itemRef": {
                        "name": payment.paymentType,
                        "value": "23"
                    },
                    "taxCodeRef": {
                        "value": "NON"
                    },
                    "qty": 1
                },
                "lineNum": 1,
                //need to increment this id.
                "id": increment(),
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



        var salesReceipt = {
            "line": line,
            "depositToAccountRef": {
                "name": "Undeposited Funds2",
                "value": "4"
            },
            "totalAmt": total,
            "balance": 0,
            "sparse": true,
            "applyTaxAfterDiscount": false,
            "txnDate": "2015-12-7T00:00:00Z"
        };



        post(salesReceipt);

    } catch (err) {
        console.log(err);
    }
};

module.exports = realTimeTransactionMap;