var salesReceipt = require('../models/salesReceipt');
var post = require('./cloudElementsClient');

var realTimeTransactionMap = function(msg) {
    try {

        var array = msg.body.data.transactionPayments;

        var lineItems = array;


        post();

    } catch (err) {
        console.log(err);
    }
};

module.exports = realTimeTransactionMap;