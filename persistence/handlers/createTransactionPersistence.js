var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var rabbitDispose = require('../lib/rabbitMsgDispose');

var deadLetterErrorHandling = function (msg, error) {
    logPlugin.error(error);
    error.deadLetter = true;
    rabbitDispose(msg, error);
};

function createTransactionPersistence(msg) {
    try {
        logPlugin.debug('Received message from Rabbit, Starting Transaction Persistence Handler');
        var valTransaction;
        var transaction = mapTransaction(msg);
        if (transaction === undefined) {
            var mapError = new Error('Failed Transaction Persistence Model Mapping');
            deadLetterErrorHandling(msg, mapError);
        } else {
            logPlugin.debug('Message Mapped to Model');
            valTransaction = validate.validateTransaction(transaction);
        }

        if (valTransaction && valTransaction.isValid) {
            logPlugin.debug('Passed Validation and Starting to Save to DB');
            transaction.save(function (err) {
                if (err) {
                    logPlugin.error(err);
                } else {
                    logPlugin.debug('Transaction was saved');
                }
                rabbitDispose(msg, err);
            });
        } else if (valTransaction && !valTransaction.isValid) {
            var valError = new Error('Failed Transaction Persistence Validation');
            deadLetterErrorHandling(msg, valError);
        }
    } catch (err) {
        deadLetterErrorHandling(msg, err);
        throw err;
    }
}

var testingStub = function (testMapTransaction, testValidate, testLogPlugin, testRabbitDispose) {
    mapTransaction = testMapTransaction.testMapTransaction;
    validate = testValidate;
    logPlugin = testLogPlugin;
    rabbitDispose = testRabbitDispose.testRabbitDispose;
};

var testFailStub = function(){
    throw new Error('BOOM!');
}

module.exports = {
    createTransactionPersistence: createTransactionPersistence,
    testingStub: testingStub,
    testFailStub: testFailStub
};