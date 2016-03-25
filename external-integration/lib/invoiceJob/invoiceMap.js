//var sampleData = require('./sampleObj');

var invoiceMap = function(invoiceToBePosted, merchConfig) {

    var lineDetail = {};
    var line = [];

    invoiceToBePosted.invoiceItems.forEach(function(item){

        var itemRef = merchConfig.salesLineItemID;
        var itemRefName = "Credit Card Sales";
        var itemAmount = item.amount;
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

        if (item.type === "discount" || item.type === "giftCard") {
            lineDetail = {
                "discountLineDetail": {
                    "discountRef": {
                        "name": itemRefName,
                        "value": itemRef
                    }
                },
                "description": "Transaction ID : " + item.transactionID,
                "detailType": "DISCOUNT_LINE_DETAIL",
                "amount": itemAmount

            };
        } else {
            lineDetail = {

                "salesItemLineDetail": {
                    "itemRef": {
                        "name": itemRefName,
                        "value": itemRef
                    }
                },
                "description": "Transaction ID : " + item.transactionID,
                "detailType": "SALES_ITEM_LINE_DETAIL",
                "amount": itemAmount

            };
        }

        line.push(lineDetail);

    });

    var invoice = {
        "customerRef": {
            "value": merchConfig.accountingCustomerID
        },
        "line": line
    };
    console.log(invoice);
    return invoice;

};

module.exports = invoiceMap;


//var sampleInvoiceItemData = [
//    {
//        transactionID:"111111",
//        amount:2015.00,
//        type:"sales"
//    },
//    {
//        transactionID:"111111",
//        amount:226.87,
//        type:"tax"
//    },
//    {
//        transactionID:"111111",
//        amount:200.15,
//        type:"discount"
//    },
//    {
//        transactionID:"111111",
//        amount:10.05,
//        type:"giftCard"
//    }
//];