var extPostQuery = require('./invoiceQuery');
var logPlugin = require('posable-logging-plugin');

var timer = function() {
    try {
        function kickoff() {
            extPostQuery();
        }
        setInterval(function(){ kickoff() }, 10000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timer();