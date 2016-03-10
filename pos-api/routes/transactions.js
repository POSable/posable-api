var express = require('express');
var router = express.Router();
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
var logPlugin = require('posable-logging-plugin');
var uuid = require('node-uuid');
var processTransaction = require('../lib/pos_modules/processTransaction').processTransaction;
var finalizePost = require('../lib/pos_modules/processTransaction').finalizePost;

router.post('/', function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " -Transactions Post received with content type of " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin);

    if (statusObject.isOK) {
        checkPostToken(jwtokenRequest, statusObject, checkPostTokenCallback);
    } else {
        finalizePost(req, res, statusObject, requestID);
    }

    function checkPostTokenCallback(err, statusObject) {

        if (err) {
            statusObject.isOK = false;
            // ensure there is an error message with the status object - but dont overight it if it already exists.
            if (!statusObject.error) statusObject['error'] = {
                error: {code: 500, message: "System Error with Token Authentication"}
            };
        }
        processTransaction(req, res, statusObject, requestID)
    }
});

module.exports = router;