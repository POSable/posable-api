var typeSum = require('./typeSum');

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();

            //console.log(hours);

            if (hours >= 23 && hours <= 23) {
                console.log("in the range");
                typeSum();
            } else {
                console.log("not in the range");

            }
        }

        setInterval(function(){ checkTime() }, 300000);

    } catch (err) {
        console.log(err)
    }
};

module.exports = timedService();


