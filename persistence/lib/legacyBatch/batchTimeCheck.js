var typeSum = require('./typeSum');

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