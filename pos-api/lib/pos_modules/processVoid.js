/**
 * Created by davidabramowitz on 3/21/16.
 */
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var configPlugin = require('posable-customer-config-plugin')();
// Modules
var sendResponse = require('./sendResponse');
var checkErrorAltResponsePath = require('./checkErrorAltResponsePath').checkErrorAltResponsePath;
// Var Extraction

var processVoid = function (req, res, statusObject, requestID) {
    logPlugin.debug("Starting processVoid");
    if (statusObject.isOK) {
        console.log("*****", statusObject.internalID)
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
        continueRaiseNewVoidEvent();
    }

    function continueRaiseNewVoidEvent() {

        if (statusObject.isOK) {
            logPlugin.debug('Sending Void Event to Rabbit');
            wascallyRabbit.raiseNewVoidEvent(statusObject.merchant.internalID, requestID, req.body).then(sendResponse(res, statusObject, requestID), function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    error: {code: 500, message: "Internal error processing void"}
                };
                checkErrorAltResponsePath(req, statusObject);
                sendResponse(res, statusObject, requestID);
            });
            logPlugin.debug('Finished processVoid');
        } else {
            logPlugin.debug('Finished processVoid');
            checkErrorAltResponsePath(req, statusObject);
            sendResponse(res, statusObject, requestID);
        }
    }
}

var testingStub = function (testLogPlugin, testWascallyRabbit, testConfigPlugin, testSendResponse, testCheckErrorAltResponsePath) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testWascallyRabbit;
    configPlugin = testConfigPlugin;
    sendResponse = testSendResponse;
    checkErrorAltResponsePath = testCheckErrorAltResponsePath
};

module.exports = {
    processVoid: processVoid,
    testingStub: testingStub
};