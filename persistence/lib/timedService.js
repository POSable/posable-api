var typeSum = require('./typeSum');
var logPlugin = require('posable-logging-plugin');
var lookup = require('posable-customer-config-plugin');
var batchMerchantsArray = [];

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();
            var time = "" + hours + mins;

            logPlugin.debug(time);

            if (time >= 150 && time <= 180) {
                logPlugin.debug("in the range");
                //console.log();
                lookup().merchantBatchLookup(function (err, docs) {
                    batchMerchantsArray = docs;
                    typeSum(batchMerchantsArray);
                });


            } else {
                logPlugin.debug("not in the range");
            }
        }

        setInterval(function(){ checkTime() }, 3000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timedService();


