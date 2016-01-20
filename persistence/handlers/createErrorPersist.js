var mapError = require('../lib/mapError');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');

var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

var createErrorPersist = function(msg){
    try {
        logPlugin.debug('Received message from Rabbit, Starting Error Persistence Handler');
        logPlugin.debug('Received from rabbit: ', JSON.stringify(msg.body));
        var newErrorModel = mapError(msg.body);

        if (newErrorModel === undefined) {
            var modelError = new Error('Failed Error Persistence Model Mapping');
            deadLetterErrorHandling(msg, modelError);
        } else {
            logPlugin.debug('Message Mapped to Model');

            newErrorModel.save(function (err) {
                if (err) {
                    logPlugin.error(err);
                    err.deadLetter = true;
                } else {
                    logPlugin.debug('Error saved successfully');
                }
                wascallyRabbit.rabbitDispose(msg, err)
            });
        }
    } catch (err) {
        deadLetterErrorHandling(msg, err);
        throw err
    }
};

var testingStub = function (testMapError, testLogPlugin, testRabbitDispose) {
    mapError = testMapError.testMapError;
    logPlugin = testLogPlugin;
    wascallyRabbit.rabbitDispose = testRabbitDispose.testRabbitDispose;
};

module.exports = {
    createErrorPersist: createErrorPersist,
    testingStub: testingStub
};