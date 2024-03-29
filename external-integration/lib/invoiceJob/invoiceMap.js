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
            itemAmount *= -1
        } if (item.type === "giftCard") {
            itemRef = merchConfig.giftLineItemID;
            itemRefName = "Gift Cards";
            itemAmount *= -1
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
            "amount": itemAmount

        };

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
