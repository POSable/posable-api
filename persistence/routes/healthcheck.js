var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var lookup = require('posable-customer-config-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
var Completed = require('../models/completed').model;
var resultsArray = [];

router.get('/', function(req, res) {

    res.status(200).send('status: 200');

    logPlugin.debug("Lets do this thing!");
    lookup().merchantBatchTrigger(function (err, docs) {
        resultsArray = docs;
        //console.log(resultsArray);

        resultsArray.forEach(function(merchant){
            var internalID = merchant.internalID;
            logPlugin.debug('Sending Batch Command to Rabbit');
            wascallyRabbit.calculateBatchTotals(internalID, internalID);

            Completed.update({ internalID: internalID }, { $set: { date: new Date() }}, function(err, raw) {
                if (err) logPlugin.error("The completed batch update response Error from mongo is : " + err);
                logPlugin.debug("The completed batch collection has been successfully updated : " + JSON.stringify(raw));
            });
        });
    });
});

module.exports = router;


Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);