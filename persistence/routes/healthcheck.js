var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var lookup = require('posable-customer-config-plugin');
var typeSum = require('../lib/typeSum');
var wascallyRabbit = require('posable-wascally-wrapper');
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
            wascallyRabbit.raiseNewBatchCommand(internalID, internalID);
        });
    });
});

module.exports = router;
