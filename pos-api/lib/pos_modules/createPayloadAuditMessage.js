/**
 * Created by davidabramowitz on 3/24/16.
 */
var wascallyRabbit = require('posable-wascally-wrapper');
var logPlugin = require('posable-logging-plugin');

var createPayloadAuditMessage = function (req, statusObject, requestID) {

    var wascallySuccessCallback = function () {
        logPlugin.debug('Successful createPayloadAuditMessage');
    };

    var wascallyErrorCallback = function() {
        logPlugin.error("Internal wascally error processing audit message");
        logPlugin.debug('Finished createPayloadAuditMessage with errors');
    };

    try {
        var payload = {body: req.body, endpoint: req.originalUrl, header: req.headers, internalID: statusObject.internalID, requestID: requestID};
        logPlugin.debug('Starting createPayloadAuditMessage');
        wascallyRabbit.raiseNewPayloadAuditEvent(statusObject.internalID, requestID, payload).then(wascallySuccessCallback, wascallyErrorCallback);
    } catch (err) {
        logPlugin.error("Internal system error processing audit message");
        logPlugin.debug('Finished createPayloadAuditMessage with system errors');
    }
};

var testingStub = function (testLogPlugin, testWascallyRabbit) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testWascallyRabbit;
};

module.exports = {
    createPayloadAuditMessage: createPayloadAuditMessage,
    testingStub: testingStub
};