var paymentQuery = require('./paymentQuery');
var logPlugin = require('posable-logging-plugin');
var createBatch = require('./createBatch');

var batchID = {};


var typeSum = function(batchMerchantsArray) {
    try {
        batchMerchantsArray.forEach(function(merchant){


            createBatch(merchant.internalID);


            paymentQuery(merchant.internalID, batchID, callback);


        });
    } catch (err) {
        logPlugin.error(err);
        return err;
    }
};

var callback = function(err, batchID, batchObject) {
    console.log(batchObject);
    batchObject.batchID = batchID;
    batchObject.status = "complete";
};

module.exports = typeSum;