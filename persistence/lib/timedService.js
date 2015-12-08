var typeSum = require('./typeSum');

var timedService = function() {
    try {

        function checkTime() {
            var d = new Date();
            var hours = d.getHours();
            var mins = d.getMinutes();
            var time = "" + hours + mins;

            console.log(time);

            if (time >= 1030 && time <= 1500) {
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


