var post = require('../lib/cloudElementsClient');
var configPlugin = require('posable-customer-config-plugin');
var err = null;

var handleRealTimePayment = function(msg, callback) {
    try {
        var id = msg.body.internalID;
    } catch (err) {
        console.log('HandleRealTimePayment MSG ID Parsing', err);
        msg.nack();
        return callback(err);
    }
    configPlugin.merchantLookup(id, function(err, merchant){
        try {
            if (err) throw err;
            if (merchant == undefined) var merchant = {}; // for testing only
            if (merchant.batchType === "real-time") {
                console.log("Real-time merchant");
                post();
            } else {
                console.log("Daily batch merchant");
                //what to do here?
            }
        } catch (err) {
            console.log('HandleRealTimePayment Merchant Lookup System Error', err);
            msg.nack();
            return callback(err);
        }
        msg.ack();
        return callback(err, id);
    });
};

module.exports = {

    handleRealTimePayment: handleRealTimePayment

};
