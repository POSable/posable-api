/**
 * Created by davidabramowitz on 3/10/16.
 */
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var checkErrorAltResponsePath = function(req, statusObject) {
    logPlugin.debug("Checking error alternate response path");
    if (!statusObject.isOK && statusObject.merchant && statusObject.merchant.responseType === 'alt') {
        logPlugin.debug("responding with alt error path");
        wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).catch(function (err) {
            logPlugin.error("Error sending Request to Rabbit", err);
        })
    } else {
        logPlugin.debug("NOT responding with alt error path");
    }
    logPlugin.debug("Finished checking error alternate response path");
};

var testingStub = function (testLogPlugin, testWascallyRabbit) {
    logPlugin = testLogPlugin;
    wascallyRabbit = testWascallyRabbit;
};

module.exports = {
    checkErrorAltResponsePath: checkErrorAltResponsePath,
    testingStub: testingStub
};