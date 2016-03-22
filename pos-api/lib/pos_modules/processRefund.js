/**
 * Created by davidabramowitz on 3/21/16.
 */
// POSable Plugins
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')();
// Modules
var createTransactionDTO = require('./api/createTransactionDTO');
var mapTransaction = require('./api/mapTransaction');
var sendResponse = require('./sendResponse');
var checkErrorAltResponsePath = require('./checkErrorAltResponsePath').checkErrorAltResponsePath;
// Var Extraction
var refundDTO = {};

var processRefund = function(req, res, statusObject, requestID) {
    logPlugin.debug("Starting processRefund");
    if (statusObject.isOK) {
        configPlugin.merchantLookup(statusObject.internalID, merchantLookupCallback);
    } else {
        checkErrorAltResponsePath(req, statusObject);
        sendResponse(res, statusObject, requestID);
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
        continueDTOandMapping();
    }

    function continueDTOandMapping() {

        if (statusObject.isOK) {refundDTO = createTransactionDTO(req, statusObject);}

        if (statusObject.isOK) {var mappedRefundDTO = mapTransaction(refundDTO, statusObject);}

        if (statusObject.isOK) {
            logPlugin.debug('Starting Validation');
            var valObject = validate.validateTransaction(mappedRefundDTO);
            if (valObject.isValid === false) {
                logPlugin.error(valObject.message);
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
            logPlugin.debug('Sending Refund Event to Rabbit');
            wascallyRabbit.raiseNewRefundEvent(statusObject.merchant.internalID, requestID, mappedRefundDTO).then(sendResponse(res, statusObject, requestID), function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 500, message: "Internal error processing refund"}
                };
                checkErrorAltResponsePath(req, statusObject);
                sendResponse(res, statusObject, requestID);
            });
            logPlugin.debug('Finished processRefund');
        } else {
            logPlugin.debug('Finished processRefund');
            checkErrorAltResponsePath(req, statusObject);
            sendResponse(res, statusObject, requestID);
        }
    }
};

var testingStub = function (testLogPlugin, testWascallyRabbit, testValidate, testConfigPlugin, testCreateTransactionDTO, testMapTransaction, testSendResponse, testCheckErrorAltResponsePath) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testWascallyRabbit;
    validate = testValidate;
    configPlugin = testConfigPlugin;
    createTransactionDTO = testCreateTransactionDTO;
    mapTransaction = testMapTransaction;
    sendResponse = testSendResponse;
    checkErrorAltResponsePath = testCheckErrorAltResponsePath;
};

module.exports = {
    processRefund: processRefund,
    testingStub: testingStub
};