var express = require('express');
var router = express.Router();
var logPlugin = require('posable-logging-plugin');
var lookup = require('posable-customer-config-plugin');
var typeSum = require('../lib/typeSum');
var resultsArray = [];

router.get('/', function(req, res) {
    res.status(200).send('status: 200');
    logPlugin.debug("Lets do this thing!");
    lookup().merchantBatchTrigger(function (err, docs) {
        resultsArray = docs;
        console.log(resultsArray);
        //publish to rabbit
        //in handler fire type sum
        typeSum(resultsArray);

    });
});

module.exports = router;
