var express = require('express');
var router = express.Router();
var log = require('../lib/pos_modules/log');
var checkPostToken = require ('../lib/pos_modules/authenticatePost');
//var uid = require('rand-token').uid;
var createPaymentDTO = require('../lib/pos_modules/createPaymentDTO');
var mapPayment = require('../lib/pos_modules/paymentMap');
var Payment = require('../models/payment');
var payment = new Payment();
var createValPayObj = require('../lib/pos_modules/validatePayment');
//var handleError = require('../lib/pos_modules/errorHandling');
var savePaymentInDB = require('../lib/pos_modules/paymentSave');
var sendResponse =require('../lib/pos_modules/sendResponse');


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

        if (err) {
            statusObject.isOK = false;
            statusObject['error'] = {
                module: "checkPostToken",
                error: {message: "System Error with Token Authentication"}
            }
        }

        if (statusObject.isOK) {paymentDTO = createPaymentDTO(req, statusObject);}

        if (statusObject.isOK) {
            var paymentObj = createValPayObj(paymentDTO);
            paymentObj.validatePayment(statusObject); }

        if (statusObject.isOK) {payment = mapPayment(paymentDTO, payment, statusObject);}

        if (statusObject.isOK) {savePaymentInDB(res, payment, statusObject, finalizePost);
        } else {finalizePost();}

        function finalizePost () {
            sendResponse(res, statusObject);
        }
    }

});


module.exports = router;

