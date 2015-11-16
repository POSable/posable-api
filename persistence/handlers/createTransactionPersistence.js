var wascally = require('wascally');
var mongoose = require('mongoose');
var Transaction = require('../models/transaction').model;

mongoose.connect('mongodb://localhost/paymentData');

function createTransactionPersistence(msg) {
    var transaction = new Transaction();

    transaction.transactionID = msg.body;



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