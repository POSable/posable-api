var mongoose = require('mongoose');
var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var batchType = require('../lib/batchType');

function createTransactionPersistence(msg) {
    //console.log(msg);

    var transaction = mapTransaction(msg);

    try { var valTransaction = validate.validateTransaction(transaction); }
    catch (err) { logPlugin.error(err); }
    console.log('after validation');

    if (!valTransaction.isValid) { console.log('Failed Validation')}

    else {
        transaction.save(function (err) {
            if (err) {
                logPlugin.error(err);
            } else {
                console.log('Transaction was saved');
            }
        });
    }

    logPlugin.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
    //batchType(msg);
}

module.exports = createTransactionPersistence;