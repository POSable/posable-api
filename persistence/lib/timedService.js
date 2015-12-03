var typeSum = require('./typeSum');

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();

            //console.log(hours);

            if (hours >= 10 && hours <= 14) {
                console.log("in the range");
                typeSum();
            } else {
                console.log("not in the range");

            }
        }

        setInterval(function(){ checkTime() }, 3000);

    } catch (err) {
        console.log(err)
    }
};

module.exports = timedService();


