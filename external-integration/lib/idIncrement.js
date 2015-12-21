
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
        console.log(err);
    }

};

module.exports = idIncrement();


