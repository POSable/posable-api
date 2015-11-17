var wascally = require('wascally');
var mongoose = require('mongoose');
var Transaction = require('../models/payment').model;
var mapPayment = require('../lib/mapPayment');

mongoose.connect('mongodb://localhost/paymentData');

function createPaymentPersistence(msg) {

    mapPayment(msg);

    //var payment = new Payment();
    //payment.transactionID = msg.body;

    payment.save(function(err) {
        if (err) {
            console.log(err);
        } else{
            console.log( 'Transaction was saved' );
        }
    });

    console.log( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
}

module.exports = createPaymentPersistence;
