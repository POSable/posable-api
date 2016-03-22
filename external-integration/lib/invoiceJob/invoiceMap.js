//var sampleData = require('./sampleObj');

var invoiceMap = function() {

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

        var itemRef = 36; //the default for sales     <------- this is where you pull in iDs from Config --no hardcode
        var itemRefName = "Credit Card Sales";
        if (item.type === "tax") {
            itemRef = 33;
            itemRefName = "Tax";
        } if (item.type === "discount") {
            itemRef = 34;
            itemRefName = "Discounts";
        } if (item.type === "giftCard") {
            itemRef = 35;
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
            "value": "4"  //needed from config
        },
        "line": line
    };

    return invoice;

};

module.exports = invoiceMap;