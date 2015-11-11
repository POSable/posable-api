var wascally = require('wascally');
var mongoose = require('mongoose');
//var saveTransactionInDB = require('../lib/saveTransaction');
var Transaction = require('../models/transaction').model;

mongoose.connect('mongodb://localhost/paymentData');

function createPersistence(msg) {
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

module.exports = createPersistence;


