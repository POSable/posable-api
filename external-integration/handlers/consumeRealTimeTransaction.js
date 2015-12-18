var post = require('../lib/cloudElementsClient');
var configPlugin = require('posable-customer-config-plugin');

var handleRealTimeTransaction = function(msg) {

    var id = msg.body.internalID;

    configPlugin.merchantLookup(id, function(err, merchant){

        //console.log(merchant);
        if (merchant.batchType == "real-time") {
            console.log("Real-time merchant");
            post();
        } else {
            console.log("Daily batch merchant");
            //what to do here? This is goin nowhere
        }
    });

    msg.ack();
};

module.exports = {

    handleRealTimeTransaction: handleRealTimeTransaction

};
