var configPlugin = require('posable-customer-config-plugin');
var timedService = require('./timedService');
var realTime = require('./realTime');

var batchType = function(msg) {
    try {
        var id = msg.body.internalID;
        configPlugin.merchantLookup(id, function(err, merchant){

            if (merchant.batchType == "real-time") {
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
