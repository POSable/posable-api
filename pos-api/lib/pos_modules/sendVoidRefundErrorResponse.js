/**
 * Created by davidabramowitz on 3/21/16.
 */

var sendResponse = require('./sendResponse');
var logPlugin = require('posable-logging-plugin');
var checkErrorAltResponsePath = require('./checkErrorAltResponsePath').checkErrorAltResponsePath;

var sendErrorResponse = function (req, res, statusObject, requestID) {
    try {
        logPlugin.debug("Starting sendVoidErrorResponse");
        statusObject.isOK = false;
        statusObject.error = new Error ('ERROR! IsVoid and IsRefund Fields are BOTH "true"');
        logPlugin.error(statusObject.error);
        checkErrorAltResponsePath(req, statusObject);
        sendResponse(req, res, statusObject, requestID);
        logPlugin.debug("Finished sendVoidErrorResponse");
    } catch (err) {
        logPlugin.error(err);
    }
}

var testingStub = function (testLogPlugin, testSendResponse, testCheckErrorAltResponsePath) {
    logPlugin = testLogPlugin;
    sendResponse = testSendResponse;
    checkErrorAltResponsePath = testCheckErrorAltResponsePath
};

module.exports = {
    sendErrorResponse: sendErrorResponse,
    testingStub: testingStub
};