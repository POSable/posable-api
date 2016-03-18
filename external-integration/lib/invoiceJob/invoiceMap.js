//var sampleData = require('./sampleObj');

var invoiceMap = function() {

    //var array = msg.body.data.transactionPayments;
    var lineDetail = {};
    var line = [];

    var sampleData = [
        {
            transactionID:"123987",
            amount:200.00,
            type:"sales" //sales/tax/gift/discount
        },
        {
            transactionID:"123987",
            amount:15.87,
            type:"tax"
        },
        {
            transactionID:"123987",
            amount:20.15,
            type:"discount"
        },
        {
            transactionID:"123987",
            amount:1.05,
            type:"giftCard"
        }
    ];

    sampleData.forEach(function(item){

        var itemRef = 12; //the default for sales     <------- this is where you pull in iDs from Config
        if (item.type === "tax") {
            itemRef = 31;
        } if (item.type === "discount") {
            itemRef = 32;
        } if (item.type === "giftCard") {
            itemRef = 33;
        }

        lineDetail = {

            "salesItemLineDetail": {
                "itemRef": {
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
            "value": "2"  //needed from config
        },
        "line": line
    };

    //console.log(invoice);

    return invoice;

};

module.exports = invoiceMap;