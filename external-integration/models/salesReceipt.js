var salesReceipt = {
    "line": [
        {
            "detailType": "SALES_ITEM_LINE_DETAIL",
            "amount": 2001,
            "salesItemLineDetail": {
                "unitPrice": 2001,
                "itemRef": {
                    "name": "MasterCard",
                    "value": "23"
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
            "amount": 3001,
            "salesItemLineDetail": {
                "unitPrice": 3001,
                "itemRef": {
                    "name": "Visa",
                    "value": "22"
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
            "detailType": "SUB_TOTAL_LINE_DETAIL",
            "amount": 5002,
            "linkedTxn": [],
            "customField": []
        }
    ],
    "depositToAccountRef": {
        "name": "Undeposited Funds2",
        "value": "4"
    },
    "totalAmt": 5002,
    "balance": 0,
    "sparse": true,
    "applyTaxAfterDiscount": false,
    "txnDate": "2015-12-7T00:00:00Z"
};

module.exports = salesReceipt;

