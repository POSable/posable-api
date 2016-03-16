var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var wascallyRabbit = require('posable-wascally-wrapper');


var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    wascallyRabbit.rabbitDispose(msg, error);
};

function createTransactionPersistence(msg) {
    logPlugin.debug('Received message from Rabbit, starting transaction persistence handler');

    try {
        var transaction = mapTransaction(msg);
        var valTransObj = validate.validateTransaction(transaction);

        if (valTransObj.isValid) {
            logPlugin.debug('Passed validation, saving to DB...');
            transaction.save(function (err) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('Transaction saved');
                }
                wascallyRabbit.rabbitDispose(msg, err);  // <-- Disposes of message with option of retry
            });
        } else if (!valTransObj.isValid) {
            var valError = new Error('Failed validation');
            deadLetterErrorHandling(msg, valError);
        }
    } catch (err) {
        deadLetterErrorHandling(msg, err);
    }
}

var testingStub = function (testMapTransaction, testValidate, testLogPlugin, testDispose) {
    if (testMapTransaction) {mapTransaction = testMapTransaction.mapTransaction;}
    if (testValidate) {validate = testValidate;}
    if (testDispose) {wascallyRabbit.rabbitDispose = testDispose.rabbitDispose;}
    if (testLogPlugin) {logPlugin = testLogPlugin;}
};

module.exports = {
    createTransactionPersistence: createTransactionPersistence,
    testingStub: testingStub
};
