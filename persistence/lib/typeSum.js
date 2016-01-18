var paymentQuery = require('./paymentQuery');
var logPlugin = require('posable-logging-plugin');

var typeSum = function(batchMerchantsArray) {
    try {
        batchMerchantsArray.forEach(function(merchant){
            paymentQuery(merchant.internalID, callback);
        });
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};

var callback = function(err, batchObject) {
    //console.log(batchObject);
};

module.exports = typeSum;