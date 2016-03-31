var logPlugin = require('posable-logging-plugin');
var extPostInvoiceQuery = require('./invoices/extPostInvoiceQuery');
var extPostPaymentQuery = require('./payments/extPostPaymentQuery');

var timer = function() {
    try {
        function kickoff() {
            extPostInvoiceQuery();
            extPostPaymentQuery();
        }
        setInterval(function(){ kickoff() }, 10000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timer();