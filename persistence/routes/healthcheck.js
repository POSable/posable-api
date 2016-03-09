var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
var mongooseMerchantBatchModel = require('../models/merchantBatchTime').model;
var CompletedBatch = require('../models/completedBatch').model;
var getQueuedMerchants = require('../lib/batchQuery');


router.get('/', function(req, res) {

    res.status(200).send('status: 200'); // for healthcheck

    //logPlugin.debug('Starting batch merchant query');
    //getQueuedMerchants(mongooseMerchantBatchModel, queryCallback);
    //
    //function queryCallback(err, merchants) {
    //    if (err) {
    //        logPlugin.error(err);
    //    } else {
    //        logPlugin.debug('Finished query');
    //        logPlugin.debug('Result : ' + JSON.stringify(merchants));
    //        publishBatchRequest(merchants);
    //    }
    //}
    //
    //function publishBatchRequest(merchants) {
    //    try {
    //        merchants.forEach(function(merchant){
    //            var internalID = merchant.internalID;
    //            logPlugin.debug('Sending Batch Command to Rabbit');
    //            wascallyRabbit.calculateBatchTotals(internalID, null);
    //            persistCompletedBatch(internalID)
    //        });
    //    } catch (err) {
    //        logPlugin.error(err);
    //    }
    //}
    //
    //    function persistCompletedBatch(internalID) {
    //        var completedBatch = new CompletedBatch();
    //        completedBatch.internalID = internalID;
    //        completedBatch.date = new Date();
    //        completedBatch.save(function (err) {
    //            if (err) {
    //                logPlugin.error(err);
    //            } else {
    //                logPlugin.debug('Completed Batch Record was saved');
    //            }
    //        });
    //    }
});

module.exports = router;
