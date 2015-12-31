var typeSum = require('./typeSum');
var logPlugin = require('posable-logging-plugin');

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();
            var time = "" + hours + mins;

            logPlugin.info(time);

            if (time >= 2353 && time <= 2359) {
                logPlugin.info("in the range");
                typeSum();
            } else {
                logPlugin.info("not in the range");
            }
        }

        setInterval(function(){ checkTime() }, 300000);

    } catch (err) {
        logPlugin.error(err);
    }
};

module.exports = timedService();


