var mongoose = require('mongoose');
var Transaction = require('../models/transaction').model;
var mapTransaction = require('../lib/mapTransaction');

var createTransactionPersistence = function(msg) {

    var transaction = mapTransaction(msg);

    transaction.save(function(err) {
        if (err) {
            console.log(err);
        } else{
            console.log( 'Transaction was saved' );
        }
    });

    console.log( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
}

module.exports = createTransactionPersistence;