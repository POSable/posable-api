var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
var MerchantBatchTime = require('../models/merchantBatchTime').model;
var CompletedBatch = require('../models/completedBatch').model;
var getQueuedMerchants = require('../lib/batchQuery');
var merchantBatches = [];

router.get('/', function(req, res) {

    res.status(200).send('status: 200');

    var queryCallback = function(err, result) {
        logPlugin.debug('Starting Batch Query');
        logPlugin.debug('Result : ' + JSON.stringify(result));
        publishBatchRequest(result);
    };

    getQueuedMerchants(queryCallback);

    function publishBatchRequest(result) {

        result.forEach(function(merchant){

            var internalID = merchant.internalID;
            logPlugin.debug('Sending Batch Command to Rabbit');
            wascallyRabbit.calculateBatchTotals(internalID, null);

            persistCompletedBatch(internalID)
        });
    }

    function persistCompletedBatch(internalID) {

        var completedBatch = new CompletedBatch();

        completedBatch.internalID = internalID;
        completedBatch.date = new Date();

        completedBatch.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Completed Batch Record was saved');
            }
        });
    }

});

module.exports = router;
