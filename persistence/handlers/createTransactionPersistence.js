var mongoose = require('mongoose');
var mapTransaction = require('../lib/mapTransaction');
var validate = require('posable-validation-plugin');
var log = require('posable-logging-plugin');

function createTransactionPersistence(msg) {

    var transaction = mapTransaction(msg);

    try { var valTransaction = validate.validateTransaction(transaction); }
    catch (err) { console.log(err); }

    if (!valTransaction.isValid) { console.log('Failed Validation')}

    else {
        transaction.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Transaction was saved');
            }
        });
    }

    //console.log( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
}

module.exports = createTransactionPersistence;