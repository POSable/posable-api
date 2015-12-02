var mongoose = require('mongoose');
var mapPayment = require('../lib/mapPayment');
var validate = require('posable-validation-plugin');
var log = require('posable-logging-plugin');

function createPaymentPersistence(msg) {

    var payment = mapPayment(msg);

    var valPayment = validate.validatePayment(payment);
    if (valPayment.isValid == false) { log.error('Failed validation') }

    payment.save(function(err) {
        if (err) {
            log.error(err);
        } else {
            log.debug('Transaction was saved');
        }
    });

    log.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
    msg.ack();
}

module.exports = createPaymentPersistence;

