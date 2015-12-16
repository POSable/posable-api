var express = require('express');
var router = express.Router();
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost');
var createPaymentDTO = require('../lib/pos_modules/api/createPaymentDTO');
var mapPayment = require('../lib/pos_modules/api/mapPayment');
var Payment = require('../models/payment').model;
var sendResponse =require('../lib/pos_modules/sendResponse');
var wascallyRabbit = require('posable-wascally-wrapper');
var validate = require('posable-validation-plugin');
var logPlugin = require('posable-logging-plugin');

router.get('/', function(req, res) {
  Payment.find(function(err, payments) {
    if (err)
        logPlugin.error(err);
        res.send(err);

    res.json(payments);
  });
});

router.post('/', function(req, res) {

    console.log("Payments Post received with content type of", req.headers['content-type']);
    var statusObject = {isOK: true, success: []};
    var paymentDTO;

    if (statusObject.isOK) {
        checkPostToken(req, statusObject, continuePost);
    }

    function continuePost(err, statusObject) {
        var payment;

        if (err) {
            logPlugin.error(err);
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {paymentDTO = createPaymentDTO(req, statusObject)}

        if (statusObject.isOK) {payment = mapPayment(paymentDTO, statusObject);}

        if (statusObject.isOK) {
            var valObject = validate.validatePayment(payment);
            if (valObject.isValid == false) {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'Payment Validation',
                    error: {code: 400, message: valObject.message} }
            }  else { statusObject.success.push('validated'); } }

        if (statusObject.isOK) {
            wascallyRabbit.raiseNewPaymentEvent(statusObject.merchant.internalID, payment).then(finalizePost, function() {
                statusObject.isOK = false;
                statusObject['error'] = {
                    module: 'payment.js',
                    error: {code: 500, message: "System Error PaymentEvent did NOT publish to Rabbit"}
                };
                finalizePost();
            })
        } else {
            finalizePost();
        }
        function finalizePost () {
            console.log("in finalize post");
            if (statusObject.merchant.responseType === 'alt') {
                console.log("before send to rabbit");
                wascallyRabbit.raiseErrorResponseEmailAndPersist(statusObject.merchant.internalID, req.body).then(sendResponse(res, statusObject), function(){
                    console.log("error sending req to rabbit");
                    sendResponse(res, statusObject);
                })

            } else {
                console.log("Response Type", statusObject);
                sendResponse(res, statusObject);
            }
        }
    }
});

module.exports = router;