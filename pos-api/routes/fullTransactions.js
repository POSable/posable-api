var express = require('express');
var router = express.Router();
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost').authenticatePost;
var reqHeaderTokenProvider = require ('../lib/pos_modules/api/reqHeaderTokenProvider');
var createTransactionDTO = require('../lib/pos_modules/api/createTransactionDTO');
var sendResponse =require('../lib/pos_modules/sendResponse');
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var uuid = require('node-uuid');
var configPlugin = require('posable-customer-config-plugin')();

router.post('/', function(req, res) {
    var requestID = uuid.v4();
    logPlugin.debug(requestID + " - fullTransactions Post received with content type of" + " " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var transactionDTO = {};

    //if (req.headers.jwtoken === null || req.headers.jwtoken === undefined) {
    //    var err = new Error('Missing json web token');
    //    logPlugin.error(err);
    //    statusObject.isOK = false;
    //    statusObject['error'] = {
    //        error: {code: 400, message: "Missing json web token"}
    //    };
    //} else {

    //    var jwtokenRequest = req.headers.jwtoken;
    //}

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin)

    if (statusObject.isOK) {checkPostToken(jwtokenRequest, statusObject, continuePost);}

    function continuePost(err, statusObject) {

        if (err) {
            statusObject.isOK = false;
            // ensure there is an error message with the status object - but dont overight it if it already exists.
            if (!statusObject.error) statusObject['error'] = {
                error: {code: 500, message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {configPlugin.merchantLookup(statusObject.internalID, merchantLookupCallback});

        function merchantLookupCallback(err, merchant) {
            var merchantError;
            if (err) {
                logPlugin.error(err);
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 500, message: 'System error searching merchant records'}
                };
            } else if (merchant === null || merchant === undefined || merchant.internalID === undefined) {
                logPlugin.debug(merchantError);
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 400, message: 'No merchant record found'}
                };
            } else {
                statusObject.merchant = merchant;
                statusObject.success.push("authenticatePost");
            }
        }

        if (statusObject.isOK) {transactionDTO = createTransactionDTO(req, statusObject);}

        if (statusObject.isOK) {
            logPlugin.debug('Starting Validation');
            var valObject = validate.validateTransaction(transactionDTO);
            if (valObject.isValid == false) {
                statusObject.isOK = false;
                statusObject['error'] = {
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
                    error: {code: 500, message: "Internal error processing transaction"}
                };
                finalizePost();
            })
        } else {
            finalizePost();
        }

        function finalizePost() {
            logPlugin.debug("Starting Finalize Post");
            if (!statusObject.isOK && statusObject.merchant && statusObject.merchant.responseType === 'alt') {
                logPlugin.debug("Sending Response to Alt Path");
                wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).catch(function () {
                    logPlugin.error("Error sending Request to Rabbit", err);
                })
            }
            logPlugin.debug("Sending HTTP Response");
            sendResponse(res, statusObject, requestID);
        }
    }
});

module.exports = router;