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
    logPlugin.debug(requestID + " -Transactions Post received with content type of " + req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var transactionDTO = {};

    var jwtokenRequest = reqHeaderTokenProvider(req, statusObject, logPlugin);

    if (statusObject.isOK) {
        checkPostToken(jwtokenRequest, statusObject, continuePost);
    } else {
        finalizePost();
    }

    function continuePost(err, statusObject) {

        if (err) {
            statusObject.isOK = false;
            // ensure there is an error message with the status object - but dont overight it if it already exists.
            if (!statusObject.error) statusObject['error'] = {
                error: {code: 500, message: "System Error with Token Authentication"}
            };

        }
        if (statusObject.isOK) {
            configPlugin.merchantLookup(statusObject.internalID, merchantLookupCallback)
        } else {
            finalizePost();
        }

        function merchantLookupCallback(err, merchant) {
            if (err) {
                logPlugin.error(err);
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 500, message: 'System error searching merchant records'}
                };
            } else if (merchant === null || merchant === undefined || merchant.internalID === undefined) {
                err = new Error('No merchant record found');
                logPlugin.debug(err);
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 400, message: 'No merchant record found'}
                };
            } else {
                statusObject.merchant = merchant;
                statusObject.success.push("merchantLookup");
            }
            continuePost2(statusObject);
        }
    }

    function continuePost2(statusObject) {

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
    }
    
    function finalizePost() {
        logPlugin.debug("Starting Finalize Post");
        if (!statusObject.isOK && statusObject.merchant && statusObject.merchant.responseType === 'alt') {
            logPlugin.debug("Sending Response to Alt Path");
            wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, requestID, statusObject['error'], req.body).catch(function(err){
                logPlugin.error("Error sending Request to Rabbit" + err);
            })
        }
        logPlugin.debug("Sending HTTP Response");
        sendResponse(res, statusObject, requestID);
    }
});

module.exports = router;
