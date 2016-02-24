var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
var MerchantBatchTime = require('../models/merchantBatchTime').model;
var Completed = require('../models/completed').model;
var resultsArray = [];

router.get('/', function(req, res) {

    res.status(200).send('status: 200');

    var d = new Date();
    var hours = d.getHours();
    var mins = d.getMinutes();
    var currentTime = "" + hours + mins;
    console.log(currentTime);

    logPlugin.debug("Lets do this thing!");
    MerchantBatchTime.find({ batchTime: { $gte: currentTime } }, {internalID: 1}, {}, function (err, resultsArray) {

        console.log(resultsArray);

        resultsArray.forEach(function(merchant){
            var internalID = merchant.internalID;
            var record = merchant._id;
            logPlugin.debug('Sending Batch Command to Rabbit');
            wascallyRabbit.calculateBatchTotals(internalID, internalID);

            MerchantBatchTime.findByIdAndUpdate({ _id: record }, {completed: Date.now() }, {new: true}, function(err, raw) {
                if (err) {
                    logPlugin.error("The completed batch update response Error from mongo is : " + err);
                } else {
                    logPlugin.debug("The completed batch collection has been successfully updated : " + JSON.stringify(raw));
                }
            });
        });
    });
});

module.exports = router;
