var logPlugin = require('posable-logging-plugin');

var idIncrement = function() {
    try {
        var increment = (function () {
            var n = 0;

            return function () {
                n += 1;

                return n;
            }
        }());



        //console.log(increment());
        //console.log(increment());
        //console.log(increment());


    } catch (err) {
        logPlugin.debug(err);
    }

};

module.exports = idIncrement();


