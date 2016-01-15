var paymentQuery = require('./paymentQuery');
var logPlugin = require('posable-logging-plugin');

var internalID;

var typeSum = function(batchMerchantsArray) {
    try {
        batchMerchantsArray.forEach(function(merchant){
            paymentQuery(merchant.internalID, callback);
            internalID = merchant.internalID;
        });
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};

var callback = function(err, batchObject) {
    console.log(batchObject);
};

module.exports = typeSum;