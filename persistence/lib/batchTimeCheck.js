var typeSum = require('./typeSum');
var lookup = require('posable-customer-config-plugin');

var batchTimeLookup = function(batchMerchantsArray) {
    try {
        batchMerchantsArray.forEach(function(merchant){

            typeSum(merchant.internalID);

        });
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};


module.exports = batchTimeLookup;