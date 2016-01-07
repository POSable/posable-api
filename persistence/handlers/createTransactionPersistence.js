var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var rabbitDispose = require('../lib/rabbitMsgDispose');

function createTransactionPersistence(msg) {
    try {
        logPlugin.debug('Received message from Rabbit, Starting Transaction Persistence Handler');
        var valTransaction = {};
        var transaction = mapTransaction(msg);

        if (transaction !== undefined) {
            logPlugin.debug('Message Mapped to Model');
            valTransaction = validate.validateTransaction(transaction);
        } else {
            var mapError = new Error('Failed Transaction Persistence Model Mapping');
            logPlugin.error(mapError);
            mapError.deadLetter = true;
            rabbitDispose(msg, mapError);
        }

        if (valTransaction && !valTransaction.isValid) {
            var valError = new Error('Failed Transaction Persistence Validation');
            logPlugin.error(valError);
            valError.deadLetter = true;
            rabbitDispose(msg, valError);
        } else {
          logPlugin.debug('Passed Validation and Starting to Save to DB');
            transaction.save(function (err) {
                if (err) {
                 logPlugin.error(err);
                } else {
                 logPlugin.debug('Transaction was saved');
                }
                rabbitDispose(msg, err);
            });
        }
    } catch (err) {
        logPlugin.debug('System Error in Transaction Persistence Handler');
        logPlugin.error(err);
        err.deadLetter = true;
        rabbitDispose(msg, err);
        throw err;
    }
}

module.exports = createTransactionPersistence;