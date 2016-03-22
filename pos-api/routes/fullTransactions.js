// 3rd Party Plugins
var express = require('express');
var uuid = require('node-uuid');
// POSable Plugins
var logPlugin = require('posable-logging-plugin');
// Modules
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
var processTransaction = require('../lib/pos_modules/processTransaction').processTransaction;
var sendResponse = require('../lib/pos_modules/sendResponse');
var checkErrorAltResponsePath = require('../lib/pos_modules/checkErrorAltResponsePath').checkErrorAltResponsePath;

// Var Extraction
var router = express.Router();

router.post('/', function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " - fullTransactions Post received with content type of" + " " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin);

    if (statusObject.isOK) {
        checkPostToken(jwtokenRequest, statusObject, checkPostTokenCallback);
    } else {
        checkErrorAltResponsePath(req, statusObject);
        sendResponse(res, statusObject, requestID);
    }

    function checkPostTokenCallback(err, statusObject) {
        if (err) {
            statusObject.isOK = false;
            // ensure there is an error message with the status object - but dont overight it if it already exists.
            if (!statusObject.error) statusObject['error'] = {
                error: {code: 500, message: "System Error with Token Authentication"}
            };
        }
        processTransaction(req, res, statusObject, requestID);
    }
});

module.exports = router;