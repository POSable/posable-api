/**
 * Created by davidabramowitz on 3/24/16.
 */

var mapPayloadAudit = require('../lib/mapPayloadAudit');
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');


var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

function payloadAuditPersistence(msg) {
    logPlugin.debug('Received message from Rabbit, starting payloadAudit persistence handler');

    try {
        var payloadAudit = mapPayloadAudit(msg);

        if (payloadAudit) {
            logPlugin.debug('saving payloadAudit Object to DB...');
            payloadAudit.save(function (err) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('payloadAudit saved');
                }
                wascallyRabbit.rabbitDispose(msg, err);  // <-- Disposes of message with option of retry
            });
        }
    } catch (err) {
        deadLetterErrorHandling(msg, err);
    }
}

var testingStub = function (testMapPayloadAudit, testLogPlugin, testDispose) {
    mapPayloadAudit = testMapPayloadAudit;
    wascallyRabbit.rabbitDispose = testDispose.rabbitDispose;
    logPlugin = testLogPlugin;
};

module.exports = {
    payloadAuditPersistence: payloadAuditPersistence,
    testingStub: testingStub
};