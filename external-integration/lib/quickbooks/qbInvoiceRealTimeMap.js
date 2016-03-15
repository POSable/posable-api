
var qbInvoiceRealTimeMap = function(msg) {

    var array = msg.body.data.transactionArray;
    var lineDetail = {};
    var line = [];
    var total = 0;


    array.forEach(function(transaction){

        total += transaction.amount;

        lineDetail = {
            //Add Tax lines here as well
            "salesItemLineDetail": {
                "itemRef": {
                    "value": "31"
                }
            },
            "description": "Credit Card Sales",
            "detailType": "SALES_ITEM_LINE_DETAIL",
            "amount": transaction.amount
        };
        line.push(lineDetail);
    });

    var invoice = {
        "customerRef": {
            "value": "2"
        },
        "line": line
    };

    return invoice;

};

module.exports = qbInvoiceRealTimeMap;