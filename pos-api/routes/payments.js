var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var checkPostToken = require ('../lib/pos_modules/api/authenticatePost');
//var uid = require('rand-token').uid;
var createPaymentDTO = require('../lib/pos_modules/api/createPaymentDTO');
var mapPayment = require('../lib/pos_modules/api/mapPayment');
var Payment = require('../models/payment').model;
var createValPayObj = require('../lib/pos_modules/api/validatePayment');
//var handleError = require('../lib/pos_modules/errorHandling');
var sendResponse =require('../lib/pos_modules/sendResponse');
var wascallyRabbit = require('posable-wascally-wrapper');

router.get('/', function(req, res) {
  Payment.find(function(err, payments) {
    if (err)
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
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {paymentDTO = createPaymentDTO(req, statusObject)}

        if (statusObject.isOK) {
            var paymentObj = createValPayObj(paymentDTO);
            paymentObj.validatePayment(statusObject);
        }

        if (statusObject.isOK) {payment = mapPayment(paymentDTO, statusObject);}

        if (statusObject.isOK) {
            wascallyRabbit.raiseNewPaymentEvent(paymentDTO).then(finalizePost, function() {
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
            sendResponse(res, statusObject);
        }
    }

});

module.exports = router;

