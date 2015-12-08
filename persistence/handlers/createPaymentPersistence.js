var mongoose = require('mongoose');
var mapPayment = require('../lib/mapPayment');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');

function createPaymentPersistence(msg) {

    var payment = mapPayment(msg);

    var valPayment = validate.validatePayment(payment);
    if (valPayment.isValid == false) { logPlugin.error('Failed validation') }

    payment.save(function(err) {
        if (err) {
            logPlugin.error(err);
        } else {
            logPlugin.debug('Transaction was saved');
        }
    });

    logPlugin.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
}

module.exports = createPaymentPersistence;

