var post = require('../lib/cloudElementsClient');
var configPlugin = require('posable-customer-config-plugin');
var logPlugin = require('posable-logging-plugin');

var handleRealTimePayment = function(msg) {

    logPlugin.debug(msg);

    var id = msg.body.internalID;
    logPlugin.debug(id);
    configPlugin.merchantLookup(id, function(err, merchant){

        if (merchant.batchType == "real-time") {
            logPlugin.debug("Real-time merchant");
            post();
        } else {
            logPlugin.debug("Daily batch merchant");
            //what to do here?
        }
    });

    msg.ack();
};


module.exports = {

    handleRealTimePayment: handleRealTimePayment

};
