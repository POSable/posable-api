//var sampleData = require('./sampleObj');

var invoiceMap = function(invoiceToBePosted, merchConfig) {

    var lineDetail = {};
    var line = [];

    var sampleData = [
        {
            transactionID:"111111",
            amount:2015.00,
            type:"sales" //sales/tax/gift/discount
        },
        {
            transactionID:"111111",
            amount:226.87,
            type:"tax"
        },
        {
            transactionID:"111111",
            amount:200.15,
            type:"discount"
        },
        {
            transactionID:"111111",
            amount:10.05,
            type:"giftCard"
        }
    ];

    sampleData.forEach(function(item){

        var itemRef = merchConfig.salesLineItemID;
        var itemRefName = "Credit Card Sales";
        if (item.type === "tax") {
            itemRef = merchConfig.taxLineItemID;
            itemRefName = "Tax";
        } if (item.type === "discount") {
            itemRef = merchConfig.discountLineItemID;
            itemRefName = "Discounts";
        } if (item.type === "giftCard") {
            itemRef = merchConfig.giftLineItemID;
            itemRefName = "Gift Cards";
        }

        lineDetail = {

            "salesItemLineDetail": {
                "itemRef": {
                    "name": itemRefName,
                    "value": itemRef
                }
            },
            "description": "Transaction ID : " + item.transactionID,
            "detailType": "SALES_ITEM_LINE_DETAIL",
            "amount": item.amount

        };

        line.push(lineDetail);

    });

    var invoice = {
        "customerRef": {
            "value": merchConfig.accountingCustomerID
        },
        "line": line
    };

    return invoice;

};

module.exports = invoiceMap;