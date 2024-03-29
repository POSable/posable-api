var paymentQuery = require('./paymentQuery');
var logPlugin = require('posable-logging-plugin');

var timer = function() {
    try {
        function kickoff() {
            paymentQuery();
        }
        setInterval(function(){ kickoff() }, 20000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timer();