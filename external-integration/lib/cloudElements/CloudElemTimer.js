var logPlugin = require('posable-logging-plugin');
var extPostInvoiceQuery = require('./invoices/extPostInvoiceQuery');
var extPostPaymentQuery = require('./payments/extPostPaymentQuery');
var extPostRefundQuery = require('./refunds/extPostRefundQuery');

var timer = function() {
    try {
        function kickoff() {
            extPostInvoiceQuery();
            extPostPaymentQuery();
            extPostRefundQuery();
        }
        setInterval(function(){ kickoff() }, 30000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timer();