// 3rd Party Plugins
var express = require('express');
var uuid = require('node-uuid');
// POSable Plugins
var logPlugin = require('posable-logging-plugin');
// Modules
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
var processTransaction = require('../lib/pos_modules/processTransaction').processTransaction;
var processVoid = require ('../lib/pos_modules/processVoid').processVoid;
var processRefund = require ('../lib/pos_modules/processRefund').processRefund;
var sendResponse = require('../lib/pos_modules/sendResponse');
var sendVoidRefundErrorResponse = require ('../lib/pos_modules/sendVoidRefundErrorResponse').sendErrorResponse;
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
        var isVoid = (req.body.Transaction.IsVoid === 'true') || false;
        var isRefund = (req.body.Transaction.IsRefund === 'true') || false;
        // Checking both IsVoid and IsRefund is true should happen first.
        if(isVoid && isRefund) return sendVoidRefundErrorResponse(req, res, statusObject, requestID);
        if(isVoid) processVoid(req, res, statusObject, requestID);
        if(isRefund) processRefund(req, res, statusObject, requestID);
        if(!isVoid && !isRefund) processTransaction(req, res, statusObject, requestID);
    }
});

module.exports = router;