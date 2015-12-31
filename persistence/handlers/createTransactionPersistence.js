var mongoose = require('mongoose');
var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var batchType = require('../lib/batchType');

function createTransactionPersistence(msg) {
    var transaction = mapTransaction(msg);
    try {
        var valTransaction = validate.validateTransaction(transaction);
    } catch (err) {
        logPlugin.error(err);
        msg.reject();
    }

    logPlugin.info('after validation');
    if (!valTransaction.isValid) { console.log('Failed Validation')}

    else {
        transaction.save(function (err) {
            if (err) {
                logPlugin.error(err);
                msg.reject();
            } else {
                console.log('Transaction was saved');
                msg.ack();
            }
        });
    }
    logPlugin.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
}

module.exports = createTransactionPersistence;