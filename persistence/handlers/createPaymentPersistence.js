// This file is not tested, currently ignored.

//var mapPayment = require('../lib/legacyBatch/mapPayment');
//var validate = require('posable-validation-plugin');
//var logPlugin = require('posable-logging-plugin');
//var rabbitDispose = require('../lib/rabbitMsgDispose');
//
//var createPaymentPersistence = function(msg) {
//    try {
//        logPlugin.debug('started Payment Persistence Plugin');
//        logPlugin.debug('Received from rabbit: ', JSON.stringify(msg.body));
//        var payment = mapPayment(msg);
//        var valPayment = validate.validatePayment(payment);
//
//        if (valPayment.isValid === false) {
//            var error = new Error('Failed Validation');
//           throw error
//        } else {
//            payment.save(function (err) {
//                if (err) {
//                    logPlugin.error(err);
//                } else {
//                    logPlugin.debug('Payment was saved');
//                }
//                rabbitDispose(msg, err);
//            });
//        }
//    } catch (err) {
//        logPlugin.debug('System Error in CreatePaymentPersistence');
//        logPlugin.error(err);
//        err.deadLetter = true;
//        rabbitDispose(msg, err);
//        throw err;
//    }
//};
//
//module.exports = createPaymentPersistence;