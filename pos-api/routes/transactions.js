var express = require('express');
var router = express.Router();
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost');
var createTransactionDTO = require('../lib/pos_modules/api/createTransactionDTO');
var sendResponse =require('../lib/pos_modules/sendResponse');
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var uuid = require('node-uuid');

router.post('/', function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " -Transactions Post received with content type of " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var transactionDTO = {};

    if (statusObject.isOK) {checkPostToken(req, statusObject, continuePost);}

    function continuePost(err, statusObject) {

        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {transactionDTO = createTransactionDTO(req, statusObject);}

        if (statusObject.isOK) {
            logPlugin.debug('Starting Validation');
            var valObject = validate.validateTransaction(transactionDTO);
            if (valObject.isValid == false) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'Transaction Validation',
                    error: {code: 400, message: valObject.message}
                }
            } else {
                logPlugin.debug('Successful Validation');
                statusObject.success.push('validated');
            }
        }

        if (statusObject.isOK) {
            logPlugin.debug('Sending Transaction Event to Rabbit');
            wascallyRabbit.raiseNewTransactionEvent(statusObject.merchant.internalID, requestID, transactionDTO).then(finalizePost, function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'payment.js',
                    error: {code: 500, message: "System Error Transaction event did NOT publish to Rabbit"}
                };
                finalizePost();
            })
        } else {
            finalizePost();
        }

        function finalizePost() {
            logPlugin.debug("Starting Finalize Post");
            if (!statusObject.isOK && statusObject.merchant.responseType === 'alt') {
                logPlugin.debug("Sending Response to Alt Path");
                wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).catch(function(err){
                    logPlugin.error("Error sending Request to Rabbit" + err);
                })
            }
            logPlugin.debug("Sending HTTP Response");
            sendResponse(res, statusObject, requestID);
        }
    }
});

module.exports = router;
