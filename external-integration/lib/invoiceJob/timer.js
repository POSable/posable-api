var invoiceQuery = require('./invoiceQuery');
var logPlugin = require('posable-logging-plugin');

var timer = function() {
    try {
        function kickoff() {
            invoiceQuery();
        }
        setInterval(function(){ kickoff() }, 10000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timer();