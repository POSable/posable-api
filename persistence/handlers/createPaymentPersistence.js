var mongoose = require('mongoose');
var Transaction = require('../models/payment').model;
var mapPayment = require('../lib/mapPayment');


function createPaymentPersistence(msg) {

    var payment = mapPayment(msg);

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

