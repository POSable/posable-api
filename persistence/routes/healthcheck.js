var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
var MerchantBatchTime = require('../models/merchantBatchTime').model;
var CompletedBatch = require('../models/completedBatch').model;
var merchantBatches = [];

router.get('/', function(req, res) {

    res.status(200).send('status: 200');

    //var d = new Date();
    //var hours = d.getHours();
    //var mins = d.getMinutes();
    //var currentTime = "" + hours + mins;
    //console.log(currentTime);

    logPlugin.debug("Lets do this thing!");
    MerchantBatchTime.find({ batchTime: "2330" }, {internalID: 1}, {}, function (err, resultsArray) {
        if (err) {
            console.log(err);
        } else {
            console.log(resultsArray);
            merchantBatches = resultsArray;
            continueBatch(merchantBatches);
        }
    });

    function continueBatch(merchantBatches) {

        merchantBatches.forEach(function(merchant){

            var internalID = merchant.internalID;
            logPlugin.debug('Sending Batch Command to Rabbit');
            wascallyRabbit.calculateBatchTotals(internalID, null);

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

            //Completed.findOneAndUpdate({internalID: internalID}, { $set : { date: new Date() }}, {new: true}, function(err, raw) {
            //    if (err) {
            //        logPlugin.error("The completed batch update response Error from mongo is : " + err);
            //    } else {
            //        logPlugin.debug("The completed batch collection has been successfully updated : " + JSON.stringify(raw));
            //    }
            //});
        });

    }

});

module.exports = router;
