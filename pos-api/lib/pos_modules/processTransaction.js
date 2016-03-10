/**
 * Created by davidabramowitz on 3/9/16.
 */
var createTransactionDTO = require('./api/createTransactionDTO');
var sendResponse =require('./sendResponse');
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var configPlugin = require('posable-customer-config-plugin')();
var mapTransaction = require('./api/mapTransaction');
var logPlugin = require('posable-logging-plugin');
var transactionDTO = {};

var finalizePost = function(req, res, statusObject, requestID) {
console.log("**************",req, res, statusObject, requestID)
    logPlugin.debug("Starting Finalize Post");
    if (!statusObject.isOK && statusObject.merchant && statusObject.merchant.responseType === 'alt') {
        logPlugin.debug("Sending Response to Alt Path");
        wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).catch(function (err) {
            logPlugin.error("Error sending Request to Rabbit", err);
        })
    }
    logPlugin.debug("Sending HTTP Response");
    sendResponse(res, statusObject, requestID);
};

var processTransaction = function(req, res, statusObject, requestID) {

    if (statusObject.isOK) {
        configPlugin.merchantLookup(statusObject.internalID, merchantLookupCallback)
    } else {
        finalizePost(req, res, statusObject, requestID);
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
        continueDTOandMapping(req, statusObject, requestID);
    }

    function continueDTOandMapping() {

        if (statusObject.isOK) {transactionDTO = createTransactionDTO(req, statusObject);}

        if (statusObject.isOK) {var mappedTransactionDTO =  mapTransaction(transactionDTO, statusObject);}

        if (statusObject.isOK) {
            logPlugin.debug('Starting Validation');
            var valObject = validate.validateTransaction(mappedTransactionDTO);
            if (valObject.isValid === false) {
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
            wascallyRabbit.raiseNewTransactionEvent(statusObject.merchant.internalID, requestID, mappedTransactionDTO).then(finalizePost(req, res, statusObject), requestID), function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 500, message: "Internal error processing transaction"}
                };
                finalizePost(req, res, statusObject, requestID);
            }
        } else {

            finalizePost(req, res, statusObject, requestID);
        }
    }
};

module.exports = {
    processTransaction: processTransaction,
    finalizePost: finalizePost
};