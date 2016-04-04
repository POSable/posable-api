var refundQuery = require('./refundQuery');

var timer = function() {
    try {
        function searchRefunds() {
            refundQuery();
        }
        setInterval(function(){ searchRefunds() }, 10000);

    } catch (err) {
        throw err; // Throws error to start.js, kills service
    }
};

module.exports = timer();