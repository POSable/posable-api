var typeSum = require('./typeSum');

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();

            if (hours >= 12 && hours <= 13) {
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


