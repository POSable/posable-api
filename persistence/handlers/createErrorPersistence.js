var mapError = require('../lib/mapError');
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');


var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

var createErrorPersistence = function(msg){
    logPlugin.debug('Received message from Rabbit, Starting Error Persistence Handler');
    logPlugin.debug('Received from rabbit: ', JSON.stringify(msg.body));

    try {
        var newError = mapError(msg);

        logPlugin.debug('Saving error to DB...');
        newError.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                logPlugin.debug('Error saved');
            }
            wascallyRabbit.rabbitDispose(msg, err);  // <-- Disposes of message with option of retry
        });

    } catch (err) {
        deadLetterErrorHandling(msg, err);
    }
};

var testingStub = function (testMapError, testLogPlugin, testDispose) {
    if (testMapError) {mapError = testMapError.mapError;}
    if (testLogPlugin) {logPlugin = testLogPlugin;}
    if (testDispose) {wascallyRabbit.rabbitDispose = testDispose.rabbitDispose;}
};

module.exports = {
    createErrorPersistence: createErrorPersistence,
    testingStub: testingStub
};