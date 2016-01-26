var paymentQuery = require('./paymentQuery');
var logPlugin = require('posable-logging-plugin');
var createBatch = require('./createBatch');


var typeSum = function(batchMerchantsArray) {
    try {
        batchMerchantsArray.forEach(function(merchant){

            createBatch(merchant.internalID);

        });
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};


module.exports = typeSum;