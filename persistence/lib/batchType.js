var configPlugin = require('posable-customer-config-plugin');
var timedService = require('./timedService');
var realTime = require('./realTime');

var batchType = function(msg) {
    try {
        var type = msg.body.data.batchType;
        var lookup = configPlugin.merchantLookup(decoded.internalID, function(err, merchant){

            if (type == "real-time") {
                console.log("Real-time merchant");
                realTime();
            } else {
                console.log("Daily batch merchant");
                timedService();
            }
        });

    } catch (err) {
        console.log(err);
    }
};

module.exports = batchType;
