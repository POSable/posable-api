var mongoose = require('mongoose');
var mapPayment = require('../lib/mapPayment');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');
var err = null;

function createPaymentPersistence(msg, callback, testMapPayment) {
    try {
        var payment = testMapPayment || mapPayment(msg);
        var valPayment = validate.validatePayment(payment);
        if (valPayment.isValid == false) {
            logPlugin.error('Failed validation');
        }
    } catch (err) {
        logPlugin.error(err);
        msg.reject();
        return callback(err, "reject")
    }

    payment.save(function(err) {
        if (err) {
            logPlugin.error(err);
            msg.reject();
            return callback(err, "reject");
        } else {
            logPlugin.debug('Transaction was saved');
            msg.ack();
            return callback(err, "ack");
        }
    });

    logPlugin.debug( 'Received from rabbit: ', JSON.stringify(msg.body) );
}

module.exports = createPaymentPersistence;