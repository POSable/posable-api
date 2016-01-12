var typeSum = require('./typeSum');
var logPlugin = require('posable-logging-plugin');

var timedService = function(id) {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();
            var time = "" + hours + mins;

            logPlugin.debug(time);

            if (time >= 1214 && time <= 1420) {
                logPlugin.debug("in the range");
                typeSum(id);
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


