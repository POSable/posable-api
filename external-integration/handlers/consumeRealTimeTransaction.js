var realTimeTransactionMap = require('../lib/realTimeTransactionMap');
var configPlugin = require('posable-customer-config-plugin');
var logPlugin = require('posable-logging-plugin');

var handleRealTimeTransaction = function(msg) {

    var id = msg.body.internalID;

    configPlugin.merchantLookup(id, function(err, merchant){

        //console.log(merchant);
        if (merchant.batchType == "real-time") {
            logPlugin.debug("Real-time merchant");
            realTimeTransactionMap(msg);
        } else {
            logPlugin.debug("Daily batch merchant");
            //what to do here? This is goin nowhere fast
        }
    });

    msg.ack();
};

module.exports = {

    handleRealTimeTransaction: handleRealTimeTransaction

};
